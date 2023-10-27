const { Sequelize} = require('sequelize');
const {Examen}=require('../models');
//const {TipoMuestra}=require('../models');


const { Usuario, OrdenTrabajo, ExamenOrden,Muestra } = require('../models'); 
const examenOrdenPost = async (req, res) => {
const { OrdenTrabajoId,ExamenId,tipoMuestraId,entregada }=req.body;
/*
tipoMuestraId   Cuando una Usuario Elige un examen, tambien me devuelve 
el tipoMuestraId para ho haacer la busqueda de vuelta
entregada ;cuando buscan el examen  les sale los tipos de muestra que tiene que 
entregar en el caso que le falte entregar la variable entregada viene en falso .
*/
let ordenId=OrdenTrabajoId;
   
try { 
    await  ExamenOrden.create({OrdenTrabajoId,ExamenId});
    await Muestra.create({
    ordenId,
    tipoMuestraId,
    entregada,
  });

  return res.status(200).json({ msg: "Examen/orden y muestra registrados en la DB." });
} catch (error) {
    console.error('Error en examenOrdenPost :', error);
      return res.status(500).json({ error});
}


};


/*
const examenOrdenGet = async (req, res) => {
  let searchTerm = req.query.term;
  console.log(searchTerm+"................");
  try {
    const usuario = await Usuario.findOne({
      where: { documento: searchTerm },
      include: [
        {
          model: OrdenTrabajo,
          include: [
            {
              model: ExamenOrden
            }
          ]
        }
      ]
    });

    if (usuario) {

      console.log("kkkkkkkkkkkkkk");
      res.json(usuario);
    } else {
      // Si no se encuentra un usuario por documento, busca por OrdenTrabajoId
      const ordenTrabajo = await OrdenTrabajo.findAll({
        where: { OrdenTrabajoId: searchTerm },
        include: [
          {
            model: ExamenOrden
          }
        ]
      });

      if (ordenTrabajo) {
        res.json(ordenTrabajo);
      } else {
        res.json({ message: 'Usuario y Orden de Trabajo no encontrados' });
      }
    }
  } catch (error) {
    console.error('Error en examenOrdenGet:', error);
    return res.status(500).json({ error: error.message });
  }
};
*/




const examenOrdenGet = async (req, res) => {
  const searchTerm = req.query.term;
  let resultados;

  if (searchTerm) {
    
    resultados = await ExamenOrden.findAll({ 
      where: {
        OrdenTrabajoId:searchTerm
      }
     // include: [{ model: Usuario }]
    });
    
  } else {
    resultados = []; 
  }

  res.json(resultados); // Devuelve los resultados en formato JSON
};

module.exports ={
    examenOrdenPost,
    examenOrdenGet
}
