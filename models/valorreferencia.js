'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ValorReferencia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     ValorReferencia.belongsTo(models.Determinacion);
    }
  }
  ValorReferencia.init({
    determinacionId: DataTypes.INTEGER,
    edadMin: DataTypes.INTEGER,
    edadMax:DataTypes.INTEGER,
    sexo:DataTypes.CHAR,
    embarazo:DataTypes.BOOLEAN,
    valorMinimo:DataTypes.DECIMAL(10,2),
    valorMaximo:DataTypes.DECIMAL(10,2),
  }, {
    sequelize,
    modelName: 'ValorReferencia',    
    tableName:'valorreferencias',
    paranoid:true,
  });
  return ValorReferencia;
};