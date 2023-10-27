'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UsuarioRol extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UsuarioRol.belongsTo(models.Usuario);
      UsuarioRol.belongsTo(models.Rol);
    }
  }
  UsuarioRol.init({
  }, {
    sequelize,
    modelName: 'UsuarioRol',
    tableName:"usuarioroles",
    paranoid:true
  });
  return UsuarioRol;
};