/*
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Resultado extends Model {
    static associate(models) {
      Resultado.hasMany(models.Determinacion, { foreignKey: 'resultadoId', onDelete: 'CASCADE' });
      Resultado.belongsTo(models.OrdenTrabajo, { onDelete: 'CASCADE' });
    }
  }
  
  Resultado.init({
    ordenTrabajoId: DataTypes.INTEGER,
    valor: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Resultado',
    tableName: 'resultados',
    paranoid: true,
  });
  
  return Resultado;
};

*/

'use strict';
const {
  Model
} = require('sequelize');
const Resultado = require('./resultado');
module.exports = (sequelize, DataTypes) => {
  class Resultado extends Model {
   
    static associate(models) {
     
      Resultado.belongsTo(models.Determinacion,{onDelete: 'CASCADE'})
      Resultado.belongsTo(models.OrdenTrabajo,{onDelete: 'CASCADE'})
    }
  }
  Resultado.init({
    ordenTrabajoId: DataTypes.INTEGER,
    determinacionId: DataTypes.INTEGER,
    valor: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Resultado',    
    tableName:'resultados',
    paranoid:true,
    
  });
  return Resultado;
};


