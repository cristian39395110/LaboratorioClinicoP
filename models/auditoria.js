'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Auditoria extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Auditoria.belongsTo(models.Usuario) // define association here
    }
  }
  Auditoria.init({
    usuarioId:DataTypes.INTEGER,
    fechaHora: DataTypes.DATE,
    tablaAfectada: DataTypes.STRING,
    operacion: DataTypes.STRING,
    registroAfectado: DataTypes.INTEGER,
    detalleAnterior: DataTypes.TEXT,
    detalleNuevo: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Auditoria',
    tableName:'auditorias',
    paranoid:true,
  });
  return Auditoria;
};