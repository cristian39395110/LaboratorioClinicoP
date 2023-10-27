'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TipoExamen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {      
      TipoExamen.hasMany(models.Examen)
    }
  }
  TipoExamen.init({
    nombre: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TipoExamen',    
    tableName:'tipoexamenes',
    timestamps:false
  });
  return TipoExamen;
};