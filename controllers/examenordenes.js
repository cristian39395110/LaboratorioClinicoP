
const { ordenPostCris } = require('./orden');
const {postMuestra}=require('./muestras');

const { ExamenOrden,Muestra,Auditoria } = require('../models'); 
const examenOrdenPost = async (req, res) => {
const { OrdenTrabajoId,ExamenId,tipoMuestraId,entregada }=req.body;


let ordenId=OrdenTrabajoId;
   
try { 
    const ex=await  ExamenOrden.create({OrdenTrabajoId,ExamenId});
    await Auditoria.create({usuarioId:req.usuario.id,tablaAfectada:'examenOrdenes',operacion:'insert',detalleAnterior:null,detalleNuevo:JSON.stringify(ex.dataValues)})
      
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

const prueba = async (req, res) => {
  const para = req.body;
  const muestraE = req.body.muestrasEntregada;
  const muestraM = req.body.muestrasNoEntregada;
  let contadorEntregada = 0;
  let contadorNoEntregada = 0;

  

  try {
    // Inicia la transacción


    const orden = await ordenPostCris(req, res); // Pasa la transacción a la función ordenPost

    const OrdenTrabajoId = orden.id;

    for (const examen of para.examenes) {
      const ExamenId = examen.idExamen;

      // Inserta el registro en ExamenOrden
      await ExamenOrden.create({ OrdenTrabajoId:OrdenTrabajoId,ExamenId:ExamenId});
      await Auditoria.create({usuarioId:req.usuario.id,tablaAfectada:'examenOrdenes',operacion:'insert',detalleAnterior:null,detalleNuevo:JSON.stringify(ex.dataValues)})
     
     
      while (contadorEntregada < muestraE.length) {
       // await postMuestra(OrdenTrabajoId,req.body.muestrasEntregada[contadorEntregada].id,1)
     
       await Muestra.create(
          {
            ordenTrabajoId: OrdenTrabajoId,
            tipoMuestraId: req.body.muestrasEntregada[contadorEntregada].id,
            entregada:1,
          }
          
          // Pasa la transacción
        );
        
        contadorEntregada++;
      }
      while (contadorNoEntregada < muestraM.length) {
       // await postMuestra(OrdenTrabajoId,req.body.muestrasEntregada[contadorEntregada].id,1)
       await Muestra.create(
          {
            ordenTrabajoId: OrdenTrabajoId,
            tipoMuestraId: req.body.muestrasNoEntregada[contadorNoEntregada].id,
            entregada:0,
          }
          // Pasa la transacción
        );
        
        contadorNoEntregada++;
      }
    }

    // Confirma la transacción
  

    
    res.render("inicioOrden", { a: true ,k:false,j:true});
    
  } catch (error) {
    console.error('Error en prueba:', error);

    // Revierte la transacción en caso de error
  
    return res.status(500).json({ error });
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
    examenOrdenGet,
    prueba
}
