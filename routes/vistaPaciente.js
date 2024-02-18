const{Router}=require('express');
const { Sequelize} = require('sequelize');
const bcryptjs=require('bcryptjs');
const { getOrdenes,getListaOrden,getOrdenesPaciente,getOrdenPacientePorId,getOrdenPacientePorIdes } = require('../controllers/orden');
const { listaDeResultado} = require('../controllers/resultados');
const {OrdenTrabajo,Usuario,Estado,Rol,Auditoria}=require('../models');
const { getEstadoOrden } = require('../controllers/estadoOrden');
const { check } = require('express-validator');
const { validarCampos0 } = require('../middlewares/validar-campos');
const { usuarioExiste, emailExiste, compararPass, nuevaPassCheck } = require('../controllers/funciones/validaciones');
const { listaDePacientes } = require('../controllers/pacientes');
const {muestrasGetPorOrdenTrabajoId}=require('../controllers/muestras');



const router=Router()

//-------------------------------------------------------------------------------------------------------

router.get('', async(req,res)=>{


    const parametroRecibido = req.query.parametro;

    const ordenes = await getOrdenesPaciente(['Informada', 'Esperando toma de muestra', 'Analitica'], parametroRecibido);
    
    //const ordenes=await getOrdenes(['Informada','Esperando toma de muestra','Analitica']);
    res.render("paciente/vistaPaciente",{ordenes})
})


router.get('/imprimir',async(req,res)=>{
    
    const parametroRecibido=req.query.ordenId;

    //const ordenes = await getOrdenPacientePorId( parametroRecibido);
        const orde = await getOrdenPacientePorIdes( parametroRecibido);
        const ordenes=[];
        const result=[];
   // const result=await listaDeResultado(parametroRecibido);

  
  
orde.Resultados.forEach(resultado => {
   
   const determinacion = resultado.Determinacion;
   result.push(resultado);
   ordenes.push(determinacion);
   const valorref=ordenes[0].dataValues.ValorReferencia[0].valorMaximo;
   console.log(result,"auxilio");
    //const valorReferencia = determinacion.dataValues.ValorReferencia;
    // Aquí puedes acceder a los atributos de la determinación
    //console.log(valorReferencia);

   // console.log(determinacion.dataValues.nombre);
    //console.log(determinacion);
});



    res.render('paciente/resultados',{result,ordenes,orde});
})



//-----------------------------------------------------------------------------------------------






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


    
    const soyBioquimico=req.usuario.Rols.some(element => element.nombre==='Paciente')
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
router.get('/editaras', async (req, res) => {
    const { ordenId } = req.query;
    const ordenTrabajoId = ordenId;  // Obtener ordenTrabajoId de req.query

    if (ordenId) {
        const orden = await OrdenTrabajo.findByPk(ordenId, { include: [{ model: Usuario, attributes: { exclude: ['contrasena'] } }, { model: Estado }] });

        const estados = await getEstadoOrden();
        const muestras = await muestrasGetPorOrdenTrabajoId(req,res,ordenTrabajoId);

        return res.render("administrativo/actualizar", { orden, estados, muestras });
    }
    return res.json({ p: "" });
});








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


/*
const { Router } = require('express');
const { check } = require('express-validator');
const { getOrdenes } = require('../controllers/orden');
const { detGet, detPost, detGetTodas, activarDeterminacion, desactivarDeterminacion } = require('../controllers/determinaciones');
const { tipoMuestrasGet, postMuestra, getVistaMuestra, activarMuestra, desactivarMuestra, muestrasGetTodos } = require('../controllers/muestras');
const router = Router();
const { ValorReferencia,Auditoria} = require("../models");
const { tipoExamenesGet } = require('../controllers/tipoexamen');
const { tieneOrden, examenesGet, examenPost, putExamen, activarExamen, examenesGetTodos, desactivarExamen } = require('../controllers/examenes');
const { postValorRef, refGetTodos, activarRef, desactivarRef, crearArregloValorRefyId } = require('../controllers/valorreferencia');
const {  procesarBody2 } = require('../middlewares/formExamen');
const { validarCampos0 } = require('../middlewares/validar-campos');
const { detValorRef } = require('../controllers/funciones/validaciones');


router.get('', async(req,res)=>{ 
  const ordenes=await getOrdenes(['Informada','Esperando toma de muestra','Analitica']);
  res.render("administrativo/listaOrdenes",{ordenes})
});


module.exports = router
*/

