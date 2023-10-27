const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ExamenOrden extends Model {
    static associate(models) {
      // Definir las asociaciones aquí
      ExamenOrden.belongsTo(models.OrdenTrabajo);
      ExamenOrden.belongsTo(models.Examen)
    }
  }

  ExamenOrden.init(
    {
      OrdenTrabajoId: DataTypes.INTEGER,
      ExamenId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'ExamenOrden',
      tableName: 'examenordenes',
      paranoid: true,
      timestamps: true
    }
  );
  

  return ExamenOrden;
};


/*
'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ExamenOrden extends Model {
    static associate(models) {
      // Definir las asociaciones aquí

      // ExamenOrden pertenece a una orden de trabajo
      ExamenOrden.belongsTo(models.OrdenTrabajo, {
        foreignKey: 'ordenId',
        as: 'orden', // El alias para la asociación
      });

      // ExamenOrden pertenece a un examen
      ExamenOrden.belongsTo(models.Examen, {
        foreignKey: 'examenId',
        as: 'examen', // El alias para la asociación
      });
    }
  }

  ExamenOrden.init(
    {
      // Define los campos y sus tipos de datos aquí si es necesario
    },
    {
      sequelize,
      modelName: 'ExamenOrden',
      tableName: 'examenordenes',
      paranoid: true
    }
  );

  return ExamenOrden;
};

*/

/*'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ExamenOrden extends Model {
  
    static associate(models) {
      // define association here
    }
  }
  ExamenOrden.init({
  }, {
    sequelize,
    modelName: 'ExamenOrden',    
    tableName:'examenordenes',
    paranoid:true
  });
  return ExamenOrden;
};

*/