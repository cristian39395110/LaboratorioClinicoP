const { Sequelize} = require('sequelize');
const {Options} = require('sequelize');
const {OrdenTrabajo,Determinacion,Usuario,Estado,Examen,ExamenOrden,Muestra,Auditoria,Resultado,ExamenDeterminacion,ValorReferencia,TipoMuestra}=require('../models');
const {Op}=require('sequelize');
//const { examenesGet } = require('./examenes');

async function cambiarEstado(ordenTrabajoId, estado, req) {
  try {
    // Buscar la orden de trabajo antes de la actualización
    const ordenAnterior = await OrdenTrabajo.findOne({ where: { id: ordenTrabajoId } });

    // Hacer una copia del estado anterior para enviarlo a la auditoría
    const estadoAnterior = ordenAnterior.estadoId ;

    // Actualizar la orden de trabajo con el nuevo estado
    await ordenAnterior.update({ estadoId: estado });

    // Crear un registro de auditoría
    await Auditoria.create({
      usuarioId: req.usuario.dataValues.id,
      tablaAfectada: 'ordenestrabajo',
      operacion: 'update',
      detalleAnterior: JSON.stringify({ estadoId: estadoAnterior }),
      detalleNuevo: JSON.stringify({ estadoId: estado })
    });

   

    return 1; // Éxito
  } catch (error) {
    console.error("Error al insertar o actualizar el estado:", error);
    return 0; // Fracaso
  }
}

const ordenPost = async (req, res) => {
    try {

      const { usuarioId,medico, diagnostico,estadoId } = req.body;

      const ordenTrabajo = await OrdenTrabajo.create({ usuarioId,medico,diagnostico,estadoId});
      await Auditoria.create({usuarioId:req.usuario.id,tablaAfectada:'ordenTrabajo',operacion:'insert',detalleAnterior:null,detalleNuevo:JSON.stringify(ordenTrabajo.dataValues)})
        
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
//--------------------------------------------------------------------------------------------------
//CONTINUACION DESPUES DE LAS VACACIONES
    const getOrdenesPaciente=async(arr,id)=>{
      
      if (arr){
        return await OrdenTrabajo.findAll({ include: [{model: Usuario,where:{id:id}},{model: Estado,where:{nombre:arr}}]});
      }
       
      return await OrdenTrabajo.findAll({ include: [{model: Usuario},{model: Estado}]});
    }  
    //_____________________________----------------------------------------------------------------
    const getOrdenPacientePorIdes = async (id) => {
      try {
        const orden = await OrdenTrabajo.findByPk(id, {
          include: [
            { model: Usuario },
            { model: Estado },
            
          
            { model: ExamenOrden,
              include: [
                {
                  model: Examen,
                  include: [
                    {
                      model: ExamenDeterminacion,
                      include: [
                        {
                          model: Determinacion,
                          include: [
                            { model: ValorReferencia },
                            { model: Resultado }
                          ]
                        }
                      ]
                    }
                    
                  ]
                }
              ]
            }
          ],
        });
    
        return orden; // Puede ser null si no se encuentra ninguna orden con el ID especificado
      } catch (error) {
        console.error("Error al obtener la orden de trabajo:", error);
        throw error;
      }
    };
    
    //{-----------------------------------------}

    const getOrdenPacientePorId = async (id) => {
      try {
        const orden = await OrdenTrabajo.findByPk(id, {
          include: [{ model: Usuario }, { model: Estado },{model:Muestra,include:[{model:TipoMuestra}]}],
        });
    
        return orden; // Puede ser null si no se encuentra ninguna orden con el ID especificado
      } catch (error) {
        console.error("Error al obtener la orden de trabajo:", error);
        throw error;
      }
    };
    
//................................................................................................................................................................................................
const getOrdenes=async(arr)=>{
 
  if (arr){
    return await OrdenTrabajo.findAll({ include: [{model: Usuario},{model: Estado,where:{nombre:arr}},{model:Muestra,include:[{model:TipoMuestra}]}]});
  }
   
  return await OrdenTrabajo.findAll({ include: [{model: Usuario},{model: Estado},{model:Muestra,include:[{model:TipoMuestra}]}]});
}
const getOrdenesDelet = async (arr) => {
  let whereClause = {};

  if (arr) {
    whereClause = { [Op.not]: null };
  }

  try {
    const ordenes = await OrdenTrabajo.findAll({
      where: { deletedAt: whereClause },
      paranoid: false, // Esto permite incluir registros eliminados lógicamente
      include: [{ model: Usuario }, { model: Estado, where: { nombre: arr } }]
    });
    return ordenes;
  } catch (error) {
    console.error('Error al obtener las órdenes:', error);
    throw new Error('Error al obtener las órdenes');
  }
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
    await Auditoria.create({usuarioId:req.usuario.id,tablaAfectada:'ordentrabajos',operacion:'insert',detalleAnterior:null,detalleNuevo:JSON.stringify(ordenTrabajo.dataValues)})
       
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
  

      const crearorden= async (req, res)=>{
    try {
        const examen=await Examen.findAll();
        res.render('inicioOrden',{ok:false,k:true,examen1:examen}); 
    } catch (error) {
       const examen=[];
        res.render('inicioOrden',{ok:false,k:true,examen1:examen}); 
    }
  

}
}


const prueba = async (req, res) => {
  const para = req.body;
 
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
      await Auditoria.create({usuarioId:req.usuario.id,tablaAfectada:'examenordenes',operacion:'insert',detalleAnterior:null,detalleNuevo:JSON.stringify(e.dataValues)})
        
     
     
      while (contadorEntregada < muestraE.length) {
        const m=await Muestra.create(
          {
            ordenTrabajoId: OrdenTrabajoId,
            tipoMuestraId: req.body.muestrasEntregada[contadorEntregada].id,
            entregada:1,
          }
          // Pasa la transacciónx
        );
        await Auditoria.create({usuarioId:req.usuario.id,tablaAfectada:'muestras',operacion:'insert',detalleAnterior:null,detalleNuevo:JSON.stringify(m.dataValues)})
        
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
        await Auditoria.create({usuarioId:req.usuario.id,tablaAfectada:'muestras',operacion:'insert',detalleAnterior:null,detalleNuevo:JSON.stringify(m.dataValues)})
       
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
    ordenPost,ordenesGet,getOrdenes,ordenPostCris,eliminarorden ,getListaOrden,crearorden,prueba,getOrdenesPaciente,getOrdenPacientePorId,getOrdenPacientePorIdes,cambiarEstado,getOrdenesDelet
  }
  
  
  
  /*
  {
     
    "usuarioId": 5,// Asocia la orden con un usuario
    "medico":"lisandro",
    "diagnostico":"Ver Sangre",
    "estadoId":1
  }
  */