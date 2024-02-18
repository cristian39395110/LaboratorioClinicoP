const { Sequelize} = require('sequelize');
const {OrdenTrabajo,Usuario,Estado,Examen,ExamenOrden,Muestra,Auditoria,Resultado}=require('../models');

async function listaDeResultado(ordenId) {
  try {
    const resultados = await Resultado.findAll({
      where: {
        ordenTrabajoId: ordenId,
      },
    });

  
    return resultados;
  } catch (error) {
    console.error('Error al buscar resultados:', error);
    throw error;
  }
}

module.exports={
    listaDeResultado
  }

  