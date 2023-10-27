'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Resultado extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Resultado.init({
    ordenId: DataTypes.INTEGER,
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