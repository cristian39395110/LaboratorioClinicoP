const {Auditoria}=require('../models');

const getAuditoria=async ()=>{
    return await Auditoria.findAll();
 
 }

 module.exports ={getAuditoria}
 