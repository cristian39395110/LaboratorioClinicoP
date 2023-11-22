const { Sequelize} = require('sequelize');
const {OrdenTrabajo,Usuario,Estado,Examen,ExamenOrden,Muestra,Auditoria}=require('../models');

//const { examenesGet } = require('./examenes');


const ordenPost = async (req, res) => {
    try {

      const { usuarioId,medico, diagnostico,estadoId } = req.body;

      const ordenTrabajo = await OrdenTrabajo.create({ usuarioId,medico,diagnostico,estadoId});
      await Auditoria.create({usuarioId:req.usuario.id,tablaAfectada:'ordenTrabajo',operacion:'insert',detalleAnterior:JSON.stringify(ordenTrabajo._previousDataValues),detalleNuevo:JSON.stringify(ordenTrabajo.dataValues)})
        
      return res.status(201).json(ordenTrabajo);
    } catch (error) {  
      console.error('Error al crear la orden de trabajo:', error);
      return res.status(500).json({ error: 'No se pudo crear la orden de trabajo' });
    }
   };


const getListaOrden=async()=>{
  
  return await OrdenTrabajo.findAll({ include: [{model: Usuario}],});
}

   const ordenesGet=async(req,res)=>{
    const orden= await OrdenTrabajo.findAll({ include: [{model: Usuario}],});
    res.render("inicioOrden",{orden: orden});
   }

    // const ordenes=await getOrdenes(['Informada','Esperando toma de muestra','Analitica']);
const getOrdenes=async(arr)=>{
  if (arr){
    return await OrdenTrabajo.findAll({ include: [{model: Usuario},{model: Estado,where:{nombre:arr}}]});
  }
   
  return await OrdenTrabajo.findAll({ include: [{model: Usuario},{model: Estado}]});
}
const ordenPostCris = async (req, res) => {
  let estadoId = 0;
  const muesE = req.body.muestrasEntregada;
  const muesN = req.body.muestrasNoEntregada;
   
  if (muesN.length == 0 && muesE.length > 0) {
    estadoId = 1;
  } else {
    estadoId = 2;
  }

  try {
    const ordenTrabajo = await OrdenTrabajo.create(
      {
        usuarioId: req.body.idDocumento,
        medico: req.body.medico,
        diagnostico: req.body.diagnostico,
        estadoId: estadoId,
      }
  
    );
    await Auditoria.create({usuarioId:req.usuario.id,tablaAfectada:'ordentrabajos',operacion:'insert',detalleAnterior:JSON.stringify(ordenTrabajo._previousDataValues),detalleNuevo:JSON.stringify(ordenTrabajo.dataValues)})
       
    return ordenTrabajo;
  } catch (error) {
    console.error('Error al crear la orden de trabajo:', error);
    throw error;
  }
};
const eliminarorden=async (req,res) => {
  
  res.render('inicioOrden',{k:false,j:true,ok:true});

  }  
  const crearorden= async (req, res)=>{
    try {
        const examen=await Examen.findAll();
        res.render('inicioOrden',{ok:false,k:true,examen1:examen}); 
    } catch (error) {
       const examen=[];
        res.render('inicioOrden',{ok:false,k:true,examen1:examen}); 
    }
  

}
const prueba = async (req, res) => {
  const para = req.body;
  console.log(para);
  const muestraE = req.body.muestrasEntregada;
  const muestraM = req.body.muestrasNoEntregada;
  let contadorEntregada = 0;
  let contadorNoEntregada = 0;

  

  try {
    // Inicia la transacción

   
    const orden = await ordenPostCris(req, res); // Pasa la transacción a la función ordenPost
    //const examenes=await examenesGet();
    const OrdenTrabajoId = orden.id;
    

    for (const examen of para.examenes) {
      const ExamenId = examen.idExamen;

      // Inserta el registro en ExamenOrden
      const e=await ExamenOrden.create({ OrdenTrabajoId:OrdenTrabajoId,ExamenId:ExamenId});
      await Auditoria.create({usuarioId:req.usuario.id,tablaAfectada:'examenordenes',operacion:'insert',detalleAnterior:JSON.stringify(e._previousDataValues),detalleNuevo:JSON.stringify(e.dataValues)})
        
     
     
      while (contadorEntregada < muestraE.length) {
        const m=await Muestra.create(
          {
            ordenTrabajoId: OrdenTrabajoId,
            tipoMuestraId: req.body.muestrasEntregada[contadorEntregada].id,
            entregada:1,
          }
          // Pasa la transacciónx
        );
        await Auditoria.create({usuarioId:req.usuario.id,tablaAfectada:'muestras',operacion:'insert',detalleAnterior:JSON.stringify(m._previousDataValues),detalleNuevo:JSON.stringify(m.dataValues)})
        
        contadorEntregada++;
      }
      while (contadorNoEntregada < muestraM.length) {
        const m=await Muestra.create(
          {
            ordenTrabajoId: OrdenTrabajoId,
            tipoMuestraId: req.body.muestrasNoEntregada[contadorNoEntregada].id,
            entregada:0,
          }
          // Pasa la transacción
        );
        await Auditoria.create({usuarioId:req.usuario.id,tablaAfectada:'muestras',operacion:'insert',detalleAnterior:JSON.stringify(m._previousDataValues),detalleNuevo:JSON.stringify(m.dataValues)})
       
        contadorNoEntregada++;
      }
    }
    const data={
      orden:orden.id,
      codigoP:req.body.idDocumento,
      nombreP:req.body.nombrePaciente,
      documentoP:req.body.documentoP,
      fechaP:orden.createdAt,
      etiquetas:true,
      ok:true
    }
    
  
   
    return res.json(data);
    //return res.redirect("/etiqueta");
  
    

  } catch (error) {
    console.error('Error en prueba:', error);
  
    return res.status(500).json({ error });
  }
};   

   module.exports={
    ordenPost,ordenesGet,getOrdenes,ordenPostCris,eliminarorden ,getListaOrden,crearorden,prueba
  }
  
  
  
  /*
  {
     
    "usuarioId": 5,// Asocia la orden con un usuario
    "medico":"lisandro",
    "diagnostico":"Ver Sangre",
    "estadoId":1
  }
  */