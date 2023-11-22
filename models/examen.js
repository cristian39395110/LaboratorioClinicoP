'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Examen extends Model {
    static associate(models) {
      
      Examen.belongsTo(models.TipoMuestra)
      Examen.belongsTo(models.TipoExamen)
      Examen.belongsToMany(models.OrdenTrabajo, {through: 'ExamenOrden'})
      Examen.hasMany(models.ExamenOrden)
      Examen.belongsToMany(models.Determinacion,{through:"ExamenDeterminacion"})      
      Examen.hasMany(models.ExamenDeterminacion)
    }
  }

  Examen.init({
     tipoMuestraId:DataTypes.INTEGER,
    nombre: DataTypes.STRING,
    detalle: DataTypes.TEXT,
    tipoExamenId:DataTypes.INTEGER,
    demora:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Examen',
    tableName: 'examenes',
    paranoid: true
  });

  return Examen;
};

/*'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Examen extends Model {

    
    static associate(models) {
      // define association here
    }
  }
  Examen.init({
    nombre: DataTypes.STRING,
    detalle: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Examen',
    tableName:'examenes',
    paranoid:true
  });
  return Examen;
};
*/