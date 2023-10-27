'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrdenTrabajo extends Model {
       static associate(models) {
      OrdenTrabajo.belongsToMany(models.Examen,{through:"ExamenOrden"})
      OrdenTrabajo.hasMany(models.ExamenOrden);
      OrdenTrabajo.belongsTo(models.Estado);
      OrdenTrabajo.belongsTo(models.Usuario)
      OrdenTrabajo.hasMany(models.Muestra)
    }
  }

  OrdenTrabajo.init({
    usuarioId: DataTypes.INTEGER,
    estadoId: DataTypes.INTEGER,
    medico: DataTypes.STRING,
    diagnostico: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'OrdenTrabajo',
    tableName: 'ordentrabajos',
    paranoid: true
  });

  return OrdenTrabajo;
};



/*'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrdenTrabajo extends Model {
 
    static associate(models) {
      // define association here
    }
  }
  OrdenTrabajo.init({
    medico: DataTypes.STRING,
    diagnostico: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'OrdenTrabajo',    
    tableName:'ordentrabajos',
    paranoid:true
  });
  return OrdenTrabajo;
};
*/
