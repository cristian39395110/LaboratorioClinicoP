const { Sequelize} = require('sequelize');
const {OrdenTrabajo,Usuario}=require('../models');

const ordenPost = async (req, res) => {
    try {

      const { usuarioId,medico, diagnostico,estadoId } = req.body;

      const ordenTrabajo = await OrdenTrabajo.create({ usuarioId,medico,diagnostico,estadoId});

      return res.status(201).json(ordenTrabajo);
    } catch (error) {  
      console.error('Error al crear la orden de trabajo:', error);
      return res.status(500).json({ error: 'No se pudo crear la orden de trabajo' });
    }
   };


   const ordenesGet=async(req,res)=>{
    const orden= await OrdenTrabajo.findAll({ include: [{model: Usuario}],});
    res.render("inicioOrden",{orden: orden});
   }
   
   module.exports={
    ordenPost,ordenesGet
  }
  
  
  
  module.exports = {
    ordenesGet,ordenPost
  };
  
  
  /*
  {
     
    "usuarioId": 5,// Asocia la orden con un usuario
    "medico":"lisandro",
    "diagnostico":"Ver Sangre",
    "estadoId":1
  }
  */