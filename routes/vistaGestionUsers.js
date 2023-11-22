
const { Router } = require('express');
const { validarCampos0 } = require('../middlewares');
const bcryptjs=require('bcryptjs');
const { Sequelize} = require('sequelize');

const { check } = require('express-validator');
const { emailExiste, compararPass, nuevaPassCheck } = require('../controllers/funciones/validaciones');
const {Usuario,Rol,UsuarioRol,Auditoria}=require('../models');
const { usersInternosGet } = require('../controllers/users');


const router = Router();


router.get('/inicio', (req, res) => { res.render("gestionUsers/inicio") })
router.get('/add',(req,res)=>{
    res.render("gestionUsers/add")
})



















router.get('/editar',async(req,res)=>{
    const {id} = req.query
    const user=await Usuario.findByPk(id,{include:{model:Rol}})
    const rol=[]
    for (elem of user.Rols){
           rol.push(elem.nombre)
    }

    return res.render('gestionUsers/add', { ruta:`/vistaGestionUsers/editar?_method=put`,form:{id,nombre:user.nombre,apellido:user.apellido,documento:user.documento,matricula:user.matricula,fechaNacimiento:user.fechaNacimiento,genero:user.genero,telefono:user.telefono,direccion:user.direccion,email:user.email,rol}})

    
})


router.put('/editar',async(req,res)=>{
  
  console.log("---------------------------------------------------");console.log(req.body);
            const {id,nombre,apellido,documento,matricula,fechaNacimiento,genero,telefono,direccion,email,rol}=req.body
            const usuario=await Usuario.findByPk(id)


            let roles = await UsuarioRol.findAll({ where: { usuarioId:id },include:[ {model:Rol,attributes: ['nombre'] },
                                                                                       {model:Usuario,attributes: ['nombre'] }
                                                                                      ] 
                                                   });
            
            roles=roles.map(elem=>elem.Rol.nombre)
            if(rol && Array.isArray(rol)){
              for(let r of rol){
                if(!roles.includes(r)){
                  const r2 = await Rol.findOne({ where: { nombre: r } });
                  await usuario.addRol(r2);
                }
              }
              for(let r of roles){            
                   if(!rol.includes(r)){
                      const r2 = await Rol.findOne({ where: { nombre: r } });
                      await UsuarioRol.destroy({where:{usuarioId:id,rolId:r2.id}})
                   }

               }
            }
            else{
              if(!roles.includes(rol)){
                const r2 = await Rol.findOne({ where: { nombre: rol } });
                await usuario.addRol(r2);
              }
              for(let r of roles){            
                if(r!==rol){
                   const r2 = await Rol.findOne({ where: { nombre: r } });
                   await UsuarioRol.destroy({where:{usuarioId:id,rolId:r2.id}})
                }

            }
            }

          



            await Usuario.update({nombre,apellido,documento,matricula,fechaNacimiento,genero,telefono,direccion,email},{where:{id}}) 
            return res.render("gestionUsers/inicio")
})


router.delete('/eliminar',async(req,res)=>{
    const {id} = req.body
    await UsuarioRol.destroy({where:{usuarioId:id}})
    await Usuario.destroy({where:{id}})
    const usuarios=await usersInternosGet()
    res.render('gestionUsers/lista',{usuarios})
})

router.post('/add',[ 
    check('nombre','introduzca caracteres válidos , por favor').matches(/^[A-Za-zÁ-Úá-úä-üñÑ]+( [A-Za-zÁ-Úá-úä-üñÑ]+)*$/),
check('apellido','Introduzca caracteres válidos , por favor').matches(/^[A-Za-zÁ-Úá-úä-üñÑ]+( [A-Za-zÁ-Úá-úä-üñÑ]+)*$/).notEmpty(),
check('documento','Sólo permitimos documentos de 7-9 dígitos.').notEmpty().matches(/^\d{7,9}$/),
check('fechaNacimiento').notEmpty().withMessage('Campo requerido'),
check('matricula').notEmpty().withMessage('Campo requerido'),
check('genero').notEmpty().isIn(['Otro', 'Femenino', 'Masculino']).withMessage('Seleccione una opción'),
check('telefono').notEmpty().withMessage('Campo requerido'),
check('direccion').isString().notEmpty().withMessage('Campo requerido.'),
check('email',"El correo no es válido").isEmail(),
check('email').custom(emailExiste),
check('rol').notEmpty().isIn(['Paciente', 'Administrativo', 'Tecnico','Bioquimico']),
async (req, res, next) => {
    req.renderizar = (errors) => {
        
  
      return res.render('gestionUsers/add', { obj:{errors },form:req.body})
    }
    next();
  },
validarCampos0
],

async(req,res)=>{
    const t = await Usuario.sequelize.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVEL_READ_COMMITTED });
  
    try {
      
      const { nombre, apellido, documento, fechaNacimiento, genero, telefono, direccion, email, matricula,embarazo, rol } = req.body;
      const contrasena = documento;
      const usuario = await Usuario.create({contrasena,email,nombre,apellido,documento,fechaNacimiento,genero,telefono,direccion,matricula,embarazo}, { transaction: t });
      
      await Auditoria.create({usuarioId:req.usuario.id,tablaAfectada:'valorreferencias',operacion:'insert',detalleAnterior:JSON.stringify(usuario._previousDataValues),detalleNuevo:JSON.stringify(usuario.dataValues)},{transaccion:t})
     
     
  
      if(!Array.isArray(rol)){
        const r = await Rol.findOne({ where: { nombre: rol } });  
        await usuario.addRol(r, { transaction: t });
      }
      else {
        for(let r of rol){
            const r2 = await Rol.findOne({ where: { nombre: rol } });
            await usuario.addRol(r2, { transaction: t });
        }
      }  
  
      const salt=bcryptjs.genSaltSync();
      usuario.contrasena=bcryptjs.hashSync(contrasena,salt);
      await usuario.save({ transaction: t });  
      await t.commit();
       
      return res.render("gestionUsers/inicio")
    } catch (err) {
      await t.rollback();
      console.log(err);
      
      return res.render('gestionUsers/add', {form:req.body })
    }
     
})



router.get('/lista',async(req,res)=>{
    const usuarios=await usersInternosGet()
    res.render('gestionUsers/lista',{usuarios})
})

module.exports = router