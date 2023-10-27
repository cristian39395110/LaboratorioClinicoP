'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TipoMuestra extends Model {
    static associate(models) {
      TipoMuestra.hasMany(models.Muestra)
      TipoMuestra.hasMany(models.Examen)
    }
  }

  TipoMuestra.init({
    nombre: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TipoMuestra',
    tableName: 'tipomuestras',
    timestamps:false
  });

  return TipoMuestra;
};


/*
}'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TipoMuestra extends Model {

    static associate(models) {
      // define association here
    }
  }
  TipoMuestra.init({
    nombre: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TipoMuestra',    
    tableName:'tipomuestras',
    timestamps:false
  });
  return TipoMuestra;
};

*/