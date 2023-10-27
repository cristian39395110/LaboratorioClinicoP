

const {Estado}=require('../models');

const getEstadoOrden=async ()=>{
   return await Estado.findAll();

}


module.exports={getEstadoOrden}