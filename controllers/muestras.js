const {TipoMuestra,Muestra,OrdenTrabajo,Auditoria}=require("../models");
const { ordenesGet, getListaOrden } = require("./orden");


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


const postMuestra=async(req,res)=>{
    console.log("--------------------------");
       console.log(req.body);
       const{ordenTrabajoId,tipoMuestraId}=req.body
       const entregada=req.body.entregada?true:false;
       const m=await Muestra.create({ordenTrabajoId,tipoMuestraId,entregada})
       await Auditoria.create({usuarioId:req.usuario.id,tablaAfectada:'muestras',operacion:'insert',detalleAnterior:JSON.stringify(m._previousDataValues),detalleNuevo:JSON.stringify(m.dataValues)})
        
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
    const muestras=await muestrasGetTodos();
    res.render('tecnicoBioq/activarMuestra',{muestras})
}



const desactivarMuestra=async(req,res)=>{
    const{id}=req.body;

    await Muestra.destroy({ where: { id } });
    
    let muestras=await muestrasGetTodos();      
    res.render('tecnicoBioq/activarMuestra',{muestras})
}
const muestrasGetPorOrdenTrabajoId = async (req,res,ordenTrabajoId) => {
    console.log(req);
    
    console.log(ordenTrabajoId,"caca");
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
   tipoMuestrasGet,postMuestra,getVistaMuestra,activarMuestra,desactivarMuestra,muestrasGetTodos,muestrasGetPorOrdenTrabajoId
}
