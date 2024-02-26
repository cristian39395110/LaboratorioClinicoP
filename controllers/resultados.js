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
async function llenarResultadoso(ordenTrabajoId, determinacionId, valor) {
  try { 
    
    const resultadoExistente = await Resultado.findOne({ where: { ordenTrabajoId, determinacionId } });

    if (resultadoExistente) {
      
      await resultadoExistente.update({ valor: valor || null }); 
      console.log(`Resultado actualizado para orden de trabajo ${ordenTrabajoId} y determinación ${determinacionId}`);
      await Auditoria.create({
        usuarioId: req.usuario.id,
        tablaAfectada: 'resultado',
        operacion: 'update',
        detalleAnterior: JSON.stringify(resultadoExistente.dataValues),
        detalleNuevo: JSON.stringify({ valor: valor || null })
      });
      return 1; 
    } else {

      const nuevoResultado = await Resultado.create({ ordenTrabajoId, determinacionId, valor: valor || null }); 
      console.log(`Nuevo resultado creado para orden de trabajo ${ordenTrabajoId} y determinación ${determinacionId}`);
      await Auditoria.create({
        usuarioId: req.usuario.id,
        tablaAfectada: 'resultado',
        operacion: 'insert',
        detalleAnterior: null,
        detalleNuevo: JSON.stringify(nuevoResultado.dataValues)
      });
      return 1;
    }
  } catch (error) {
    console.error("Error al insertar o actualizar el resultado:", error);
    return 0; 
  }  
}

module.exports={
    listaDeResultado,llenarResultadoso
  }

  