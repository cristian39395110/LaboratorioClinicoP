'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Muestra extends Model {
    static associate(models) {

      Muestra.belongsTo(models.OrdenTrabajo);
      Muestra.belongsTo(models.TipoMuestra);
  }
}

  Muestra.init({
    ordenTrabajoId: DataTypes.INTEGER,
    tipoMuestraId: DataTypes.INTEGER,
    entregada: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Muestra',
    tableName: 'muestras',
    paranoid: true
  });

  return Muestra;
};


/*
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Muestra extends Model {
  
    static associate(models) {
      // define association here
    }
  }
  Muestra.init({
    entregada: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Muestra',    
    tableName:'muestras',
    paranoid:true
  });
  return Muestra;
};

*/