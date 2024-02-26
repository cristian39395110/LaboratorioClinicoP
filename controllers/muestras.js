const {TipoMuestra,Muestra,OrdenTrabajo,Auditoria}=require("../models");
const { ordenesGet, getListaOrden } = require("./orden");
const { Op } = require('sequelize');


const tipoMuestrasGet=async()=>{
try {
    const muestras=  await TipoMuestra.findAll();
    return muestras
      //return res.status(200).json(det);
} catch (error) {
    //return res.status(500).json({ error: 'No se pudieron obtener a le determinacion' });
    return {error}
}


}
// Función para obtener el ID de un tipo de muestra dado su nombre
// Función para obtener el ID de un tipo de muestra dado su nombre
const obtenerTipoMuestraId = async (nombreTipoMuestra) => {
  const tipoMuestra = await TipoMuestra.findOne({ where: { nombre: nombreTipoMuestra } });
  if (tipoMuestra) {
    console.log(tipoMuestra,"que hay en el id tipo de muestra");
    return tipoMuestra.id;
  } else {
    throw new Error(`Tipo de muestra '${nombreTipoMuestra}' no encontrado`);
  }
};

const actualizarMuestras = async (res, ordenTrabajoId, muestrasMarcadas, muestrasTotal) => {
  console.log(Array.isArray(muestrasMarcadas));
  try {
      // Verificar si hay muestras marcadas
      if (Array.isArray(muestrasMarcadas) && muestrasMarcadas.length > 0) {
          console.log("Hay muestras marcadas");
          const muestrasMarcadasIds = [];
          for (const muestraMarcada of muestrasMarcadas) {
              const tipoMuestraId = await obtenerTipoMuestraId(muestraMarcada);
              muestrasMarcadasIds.push(tipoMuestraId);
              await Muestra.update({ entregada: 1 }, { where: { 
                ordenTrabajoId, 
                tipoMuestraId: tipoMuestraId 
            }});
          }
        
      } else {
          console.log("No hay muestras marcadas, actualizando todas como no entregadas");
          await Muestra.update({ entregada: 0 }, { where: { ordenTrabajoId } });
      }

      //res.status(200).json({ message: "Muestras actualizadas correctamente" });
  } catch (error) {
      console.error("Error al actualizar las muestras:");
      //res.status(500).json({ error: "Hubo un error al actualizar las muestras" });
  }
};

const postMuestra=async(req,res)=>{
   
       
       const{ordenTrabajoId,tipoMuestraId}=req.body
       const entregada=req.body.entregada?true:false;
       const m=await Muestra.create({ordenTrabajoId,tipoMuestraId,entregada})
       await Auditoria.create({usuarioId:req.usuario.id,tablaAfectada:'muestras',operacion:'insert',detalleAnterior:null,detalleNuevo:JSON.stringify(m.dataValues)})
        
       const tipoM= await tipoMuestrasGet();
        const ordenes= await getListaOrden();
       res.render('tecnicoBioq/addMuestra',{ordenes,tipoM,modal:"Muestra agregada."})
}

const getVistaMuestra=async(req,res)=>{

        const tipoM= await tipoMuestrasGet();
        const ordenes= await getListaOrden();
        res.render('tecnicoBioq/addMuestra',{ordenes,tipoM,modal:false})
}


const muestrasGetTodos=async()=>{
      return  await Muestra.findAll({paranoid:false,include:[{model:OrdenTrabajo},{model:TipoMuestra}]})
}

const activarMuestra=async(req,res)=>{
    const{id}=req.body;
    await Muestra.restore({where:{id}}) 
    const muestra = await Muestra.findByPk(id);
    await Auditoria.create({
        usuarioId: req.usuario.id,
        tablaAfectada: 'muestras',
        operacion: 'activar',
        detalleAnterior: null,
        detalleNuevo: JSON.stringify(muestra.dataValues)
    });
    const muestras=await muestrasGetTodos();
    res.render('tecnicoBioq/activarMuestra',{muestras})
}



const desactivarMuestra=async(req,res)=>{
    const{id}=req.body;

    await Muestra.destroy({ where: { id } });
    await Auditoria.create({
      usuarioId: req.usuario.id,
      tablaAfectada: 'muestras',
      operacion: 'desactivar',
      detalleAnterior: null,
      detalleNuevo: JSON.stringify(muestra.dataValues)
  });
    let muestras=await muestrasGetTodos();      
    res.render('tecnicoBioq/activarMuestra',{muestras})
}
const muestrasGetPorOrdenTrabajoId = async (req,res,ordenTrabajoId) => {
  
    try {
      // Paso 1: Obtener los tipos de muestra asociados al ordenTrabajoId
      const tiposMuestraAsociados = await TipoMuestra.findAll({
        include: [{
          model: Muestra,
          include: {
            model: OrdenTrabajo,
            where: {
              id: ordenTrabajoId,
            },
          },
        }],
      });
      
      // Paso 2: Filtrar los tipos de muestra para obtener solo los asociados a la orden de trabajo
      const tiposMuestraFiltrados = tiposMuestraAsociados.filter((tipoMuestra) => tipoMuestra.Muestras.length > 0);
      
      // Paso 3: Recorrer los tipos de muestra filtrados y obtener las muestras correspondientes
      const muestrasPorTipo = [];
      for (const tipoMuestra of tiposMuestraFiltrados) {
        const muestras = tipoMuestra.Muestras || [];
        muestrasPorTipo.push({
          tipoMuestra: tipoMuestra.nombre,
          muestras: muestras.map((muestra) => ({
            id: muestra.id,
            entregada: muestra.entregada,
          })),
        });
      }
  
      return (muestrasPorTipo);
    } catch (error) {
      console.error("Error al obtener las muestras por orden de trabajo y tipo de muestra:", error);
      throw error;
    }
  };
module.exports={
   tipoMuestrasGet,postMuestra,getVistaMuestra,activarMuestra,desactivarMuestra,muestrasGetTodos,muestrasGetPorOrdenTrabajoId,actualizarMuestras
}
