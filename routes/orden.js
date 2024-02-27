  const{Router, query}=require('express');
const {ordenPost,ordenesGet,eliminarorden,ordenPostCris,crearorden,prueba,getOrdenes,getOrdenesDelet,getOrdenPacientePorId,actualizarMuestras}=require('../controllers/orden');
const {TipoMuestra,Muestra,OrdenTrabajo,Auditoria}=require("../models");
const { Op} = require('sequelize');
const router=Router();
/* 
router.post('/',ordenPost);
router.get('/',ordenesGet);
router.post('/',ordenPostCris);
router.post('/eliminarorden',eliminarorden);   */  
router.get('/obtenerOrdenesDadasDeBaja', async (req, res) => { // Corrige el paréntesis
  console.log('calabza');
  let j = false;
  let k = false;
  try {
    // Consulta todas las órdenes donde `deletedAt` no es nulo
    const ordenes=await getOrdenesDelet(['Informada','Esperando toma de muestra','Analitica']);

    console.log(ordenes,"que oasi")
    res.render("administrativo/listaOrdenesBorrado", { ordenes, j: false, k: true }); 
  } catch (error) {
    console.error('Error al obtener las órdenes dadas de baja:', error);
    throw new Error('Error al obtener las órdenes dadas de baja');
  }
});

router.get('/etiqueta',async (req, res) => {
  
   
    const orden = req.query.orden;
    const codigoP = req.query.codigoP;
    const nombreP = req.query.nombreP;
    const documentoP = req.query.documentoP;
    const fechaP = req.query.fechaP;
    
    const fechaOriginal = fechaP;
  const fecha = new Date(fechaOriginal);
  
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses se indexan desde 0
  const dia = String(fecha.getDate()).padStart(2, '0');
  let contador=0;
  let codigoPersona=[];
  const fechaFormateada = `${dia}-${mes}-${anio}`;
  const ordenes=await getOrdenPacientePorId(orden);
  console.log("cabeza",ordenes.Muestras[0].dataValues.TipoMuestra,"termo"); 
  
  if(ordenes.Muestras!=null){
    for(var i=0;i<ordenes.Muestras.length;i++){ 
         if(ordenes.Muestras[i].entregada){
          codigoPersona.push(ordenes.Muestras[i].dataValues.TipoMuestra.nombre);
          contador++
         }
   }
  }
   if(contador>0){
    res.render('etiqueta', {
      numeroOrden: orden,
      codigoPersona: codigoPersona,
      nombre: nombreP,
      documentoPaciente: documentoP,
      fechaHora: fechaFormateada
    });
  }
  });
router.get('/',async (req, res) => {
  const ordenes=await getOrdenes(['Informada','Esperando toma de muestra','Analitica']);
  let k=true;
  let j=false;
  
  res.render("administrativo/ordenes",{ordenes,k:false,j:true}) // Para Probar la pagina inicioOrdemn
  });
  router.get('/actualizar-orden', (req, res) => {
   const ok = true;
    res.render('inicioOrden',{ok}); 
  });
  router.get('/crearorden',crearorden);
  router.post('/prueba',prueba);
  
  router.get('/formulario', (req, res) => {
   console.log("holaa") ;
   const k=true;
  
  //res.render('inicioOrden',{k,ok:true})
  
  }); 

module.exports=router;

