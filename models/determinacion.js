'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Determinacion extends Model {
    
    static associate(models) {
      Determinacion.hasMany(models.ValorReferencia)
      Determinacion.hasMany(models.ExamenDeterminacion)
      Determinacion.belongsToMany(models.Examen,{through:"ExamenDeterminacion"})
      Determinacion.hasMany(models.Resultado) 
    }
  }
  Determinacion.init({
    nombre: DataTypes.STRING,
    unidadMedida:DataTypes.STRING,
    valorMin: DataTypes.DECIMAL(10,2),
    valorMax: DataTypes.DECIMAL(10,2)
  }, {
    sequelize,
    modelName: 'Determinacion',
    tableName:'determinaciones',
    paranoid:true,
  });
  return Determinacion;
};