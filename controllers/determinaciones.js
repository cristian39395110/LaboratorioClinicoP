const Sequelize = require('sequelize');
const{response}=require('express');
const {Determinacion,Resultado,ValorReferencia,Auditoria}=require("../models")



const detGetTodas=async()=>{
    try {
        const determinaciones = await Determinacion.findAll( {paranoid:false});
        
        return determinaciones
      } catch (error) {
        console.error(error);
        return({ok:false})
      }
}

const detPost=async(req,res=response)=>{
     try{ 
        
        const {nombre,unidadMedida,valorMin,valorMax,comentarios}=req.body;
      const au=await Determinacion.create({nombre,unidadMedida,valorMin,valorMax,comentarios});
      await Auditoria.create({usuarioId:req.usuario.id,tablaAfectada:'determinaciones',operacion:'insert',detalleAnterior:null,detalleNuevo:JSON.stringify(au.dataValues)})
        
      return res.render('tecnicoBioq/formDeterminacion',{modal:"Determinación agregada."})}
    catch{
        console.log(error);
        return res.json({msg:"Error al insertar una determinacion en la DB",error})
    }  


}

const detPostidexamen=async(req,res=response)=>{
    try{ const {examenId,nombre,unidadMedida,valorMin,valorMax,comentarios}=req.body;
     const au=await Determinacion.create({nombre,unidadMedida,valorMin,valorMax,comentarios,examenId});
     await Auditoria.create({usuarioId:req.usuario.id,tablaAfectada:'determinaciones',operacion:'insert',detalleAnterior:null,detalleNuevo:JSON.stringify(au.dataValues)})
      
     return res.json({msg:"Determinacion insertada en la DB Con su Examen"})}
   catch{
       console.log(error);
       return res.json({msg:"Error al insertar una determinacion en la DB",error})
   }  


}





//-------------------------------------------------------------------


const detGet=async()=>{

try {
    const det=  await Determinacion.findAll();
    return det
      //return res.status(200).json(det);
} catch (error) {
console.log(error);
    return error

}


}

const activarDeterminacion=async(req,res)=>{
    const{id}=req.body
    await Determinacion.restore({where: {id}})
    await ValorReferencia.restore({ where: { determinacionId: id } });
    await Resultado.restore({ where: { determinacionId: id } }); 
    await Auditoria.create({
      usuarioId: req.usuario.id,
      tablaAfectada: 'determinaciones',
      operacion: 'activar',
      detalleAnterior: null,
      detalleNuevo: `Determinación activada: ${determinacion.nombre}`
  });
      const determinaciones=await detGetTodas()
      res.render('tecnicoBioq/activarDeter',{determinaciones})

}


const desactivarDeterminacion=async(req,res)=>{
    const{id}=req.body;

  
      await ValorReferencia.destroy({ where: { determinacionId: id } });
      await Resultado.destroy({ where: { determinacionId: id } }); 
      await Determinacion.destroy({where:{id}})
      await Auditoria.create({
        usuarioId: req.usuario.id,
        tablaAfectada: 'determinaciones',
        operacion: 'desactivar',
        detalleAnterior: JSON.stringify(determinacion.dataValues),
        detalleNuevo: null
    });
      const determinaciones=await detGetTodas()
      res.render('tecnicoBioq/activarDeter',{determinaciones})

}

module.exports={
    detPost,
    detGet,
    detPostidexamen,
    detGetTodas,activarDeterminacion,desactivarDeterminacion
}

/*

{   "edadMin":" " ,
    "edadMax":" " ,
    "sexo":" " ,
    "embarazo":" " ,
    "valorMinimo":" " ,
    "valorMaximo":" "
}
*/