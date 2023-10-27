const {ValorReferencia,Determinacion}=require('../models');
const { detGet } = require('./determinaciones');

const valorReferenciaPost=async(req,res)=>{
    try {
        const {determinacionId,edadMin,edadMax,sexo,embarazo,valorMinimo,valorMaximo}=req.body;

        await ValorReferencia.create({determinacionId,edadMin,edadMax,sexo,embarazo,valorMinimo,valorMaximo});
        return res.json({msg:"valor de referencia insertada en la DB"})
    } catch (error) {
        console.log(error);
        return res.json({msg:"Error al insertar un valor de referencia en la DB",
                        error})
    }
}


const postValorRef=async(req,res)=>{
    let {determinacionId,edadMin,edadMax,sexo,embarazo,valorMinimo,valorMaximo}=req.body;
     console.log(determinacionId); 
    await ValorReferencia.create({determinacionId: parseInt(req.body.determinacionId, 10),edadMin,edadMax,sexo,embarazo,valorMinimo,valorMaximo})
    let arrDet= await detGet();
    res.render('tecnicoBioq/addReferencia',{arrDet,modal:"Valor de referencia agregado."})
 }


const refGetTodos=async(req,res)=>{
    try {
        const valorRef = await ValorReferencia.findAll( {paranoid:false,include: [{model: Determinacion}]});
        console.log(valorRef);
        return valorRef
      } catch (error) {
        console.error(error);
        return({ok:false})
      }
}

const activarRef=async(req,res)=>{
    const{id}=req.body;
    await ValorReferencia.restore({where:{id}})
    let arrRef=await refGetTodos();
    res.render('tecnicoBioq/activarRef',{arrRef})
}


const desactivarRef=async(req,res)=>{
    const{id}=req.body;

    await ValorReferencia.destroy({ where: { id } });
    
    let arrRef=await refGetTodos();
    res.render('tecnicoBioq/activarRef',{arrRef})

}

module.exports={valorReferenciaPost,postValorRef,refGetTodos,activarRef,desactivarRef}


