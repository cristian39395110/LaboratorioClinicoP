const{Router}=require('express');
const { Sequelize} = require('sequelize');
const bcryptjs=require('bcryptjs');
const { getOrdenes,cambiarEstado } = require('../controllers/orden');
const {OrdenTrabajo,Usuario,Estado,Rol,Auditoria}=require('../models');
const { getEstadoOrden } = require('../controllers/estadoOrden');
const { check } = require('express-validator');
const { validarCampos0 } = require('../middlewares/validar-campos');
const { usuarioExiste, emailExiste, compararPass, nuevaPassCheck } = require('../controllers/funciones/validaciones');
const { listaDePacientes } = require('../controllers/pacientes');
const {muestrasGetPorOrdenTrabajoId}=require('../controllers/muestras');



const router=Router()



router.get('/listaOrdenes', async(req,res)=>{
    /*Actualización de Orden de Trabajo (siempre y cuando todavía este en los estado "ingresada" y "esperando toma de muestra" y "Analítica") */
    const ordenes=await getOrdenes(['Informada','Esperando toma de muestra','Analitica']);
    res.render("administrativo/listaOrdenes",{ordenes})
})






router.get('/editar',async(req,res)=>{

    const {ordenId}=req.query;
    if(ordenId){
        const orden=await OrdenTrabajo.findByPk(ordenId,{ include: [{model: Usuario, attributes: {exclude: ['contrasena']}},
                                                                    {model: Estado}]});
        
        const estados=await getEstadoOrden();
        return res.render("administrativo/actualizar",{orden,estados})
    }
    return res.json({p:""})
})


router.get('/inicio',async(req,res)=>{ 


    
    const soyBioquimico=req.usuario.Rols.some(element => element.nombre==='Bioquimico')
    res.render("inicioAdmin2/inicioAdmin2",{soyBioquimico,modal:false,nombreUsuario:`${req.usuario.nombre} ${req.usuario.apellido}`})
})

///////////////////////////////////////////////////////////////////////////////////////////////////// PACIENTES
router.get('/inicio/personas',async(req,res)=>{
    const pacientes=await listaDePacientes()
    res.render("gestionPacientes/inicio",{modal:false,pacientes})
})





router.get('/editarPaciente',async(req,res)=>{
    const {id} = req.query
    const user=await Usuario.findByPk(id,{include:{model:Rol}})
   

    return res.render('gestionPacientes/add', { ruta:`/vistaAdmin/editarPaciente?_method=put`,form:{embarazo:user.embarazo,id,nombre:user.nombre,apellido:user.apellido,documento:user.documento,fechaNacimiento:user.fechaNacimiento,genero:user.genero,telefono:user.telefono,direccion:user.direccion,email:user.email}})

    
})


router.put('/editarPaciente',async(req,res)=>{
         const pacientes=await listaDePacientes()
            const {id,nombre,apellido,documento,matricula,fechaNacimiento,genero,telefono,direccion,email,embarazo}=req.body
            await Usuario.update({nombre,apellido,documento,matricula,fechaNacimiento,genero,telefono,direccion,email,embarazo},{where:{id}})
            return res.render("gestionPacientes/inicio",{pacientes})
})
//-------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------
router.put('/editarSoloEstado',async(req,res)=>{
  
    if(req.body.muestrasEntregadas!=null && req.body.muestrasTotal!=null)
    {
       if(req.body.muestrasEntregadas.length==req.body.muestrasTotal.length){
        console.log("Analitica");
        await cambiarEstado(req.body.id,1);
       }else{console.log("falta muestra")
       await cambiarEstado(req.body.id,2);}

    }
    else{
        if(req.body.muestrasEntregadas=="" && req.body.muestrasTotal=="")
        {
         console.log("Analitica");
         await cambiarEstado(req.body.id,1);
        
        }

         else{
            console.log("Esperandto toma");
            await cambiarEstado(req.body.id,2);
        }
}
const ordenes=await getOrdenes(['Informada','Esperando toma de muestra','Analitica']);
res.render("administrativo/listaOrdenes",{ordenes})
})

//-------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------

router.get('/editaras', async (req, res) => {
    const { ordenId } = req.query   ;
    const ordenTrabajoId = ordenId;  // Obtener ordenTrabajoId de req.query

    if (ordenId) {
        const orden = await OrdenTrabajo.findByPk(ordenId, { include: [{ model: Usuario, attributes: { exclude: ['contrasena'] } }, { model: Estado }] });

        const estados = await getEstadoOrden();
        const muestras = await muestrasGetPorOrdenTrabajoId(req,res,ordenTrabajoId);

        return res.render("administrativo/actualizarcheck", { orden, estados, muestras });
    }
    return res.json({ p: "" });
});






router.get('/add',(req,res)=>{
    res.render('gestionPacientes/add')
})

router.post('/add',[ 
    check('nombre','introduzca caracteres válidos , por favor').matches(/^[A-Za-zÁ-Úá-úä-üñÑ]+( [A-Za-zÁ-Úá-úä-üñÑ]+)*$/),
check('apellido','Introduzca caracteres válidos , por favor').matches(/^[A-Za-zÁ-Úá-úä-üñÑ]+( [A-Za-zÁ-Úá-úä-üñÑ]+)*$/).notEmpty(),
check('documento','Sólo permitimos documentos de 7-9 dígitos.').notEmpty().matches(/^\d{7,9}$/),
check('fechaNacimiento').notEmpty().withMessage('Campo requerido'),
check('embarazo').notEmpty().withMessage('Campo requerido'),
check('genero').notEmpty().isIn(['Otro', 'Femenino', 'Masculino']).withMessage('Seleccione una opción'),
check('telefono').notEmpty().withMessage('Campo requerido'),
check('direccion').isString().notEmpty().withMessage('Campo requerido.'),
check('email',"El correo no es válido").isEmail(),
check('email').custom(emailExiste),
async (req, res, next) => {
    req.renderizar = async(errors) => {
      return res.render('gestionPacientes/add', { obj:{errors },form:req.body})
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
      await Auditoria.create({usuarioId:req.usuario.id,tablaAfectada:'usuarios',operacion:'insert',detalleAnterior:JSON.stringify(usuario._previousDataValues),detalleNuevo:JSON.stringify(usuario.dataValues)})
        
     
     
            const r = await Rol.findOne({ where: { nombre: 'Paciente' } });
            await usuario.addRol(r, { transaction: t });
        
  
      const salt=bcryptjs.genSaltSync();
      usuario.contrasena=bcryptjs.hashSync(contrasena,salt);
      await usuario.save({ transaction: t });  
      await t.commit();
      const pacientes=await listaDePacientes()
      return res.render("gestionPacientes/inicio",{modal:false,pacientes})
    } catch (err) {
      await t.rollback();
      console.log(err);
      
      return res.render('gestionPacientes/add', {form:req.body })
    }
     
})

//////////////////////////////////////////////////////////////////////////////////////////

router.put('/editar',
[check('usuario').notEmpty().withMessage('Valor requerido.'),
check('usuario').custom(usuarioExiste),
check('medico').notEmpty().withMessage('Valor requerido.'),
check('diagnostico').notEmpty().withMessage('Valor requerido.'),
check('estadoId').notEmpty().withMessage('Valor requerido.'),
async(req, res, next) => {
    const orden=await OrdenTrabajo.findByPk(req.body.id,{ include: [{model: Usuario, attributes: {exclude: ['contrasena']}},
    {model: Estado}]});
    const estados=await getEstadoOrden();
   req.renderizar=(errors)=>{
    res.render('administrativo/actualizar',{estados,errors,orden})
   } 
    next(); 
    },
validarCampos0
]
,async(req,res)=>{
try{

    const{id,medico,diagnostico,estadoId}=req.body
    const nuevosValores={ usuarioId:req.user.id,estadoId,medico,diagnostico}
    OrdenTrabajo.update(nuevosValores, {where: {id}})
    res.render("administrativo/inicio",{modal:"Orden de trabajo actualizada"})
}
catch(err){
    console.log(err);
}
})

module.exports=router

