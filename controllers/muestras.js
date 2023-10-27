const {TipoMuestra,Muestra}=require("../models");
const { getEstadoOrden } = require("./estadoOrden");
const { ordenesGet } = require("./orden");


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
       console.log(req.body);
       const{ordenId,tipoMuestraId}=req.body
       const entregada=req.body.entregada?true:false;
       await Muestra.create({ordenId,tipoMuestraId,entregada})
       const tipoM= await tipoMuestrasGet();
        const ordenes= await ordenesGet();
       res.render('tecnicoBioq/addMuestra',{ordenes,tipoM,modal:"Muestra agregada."})
}

const getVistaMuestra=async(req,res)=>{

        const tipoM= await tipoMuestrasGet();
        const ordenes= await ordenesGet();
        res.render('tecnicoBioq/addMuestra',{ordenes,tipoM,modal:false})
}


const activarMuestra=(req,res)=>{

}

const desactivarMuestra=(req,res)=>{

}

module.exports={
   tipoMuestrasGet,postMuestra,getVistaMuestra,activarMuestra,desactivarMuestra
}
