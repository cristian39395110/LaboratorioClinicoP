  const{Router}=require('express');
const {ordenPost,ordenesGet,eliminarorden,ordenPostCris,crearorden,prueba,getOrdenes,actualizarMuestras}=require('../controllers/orden');

const router=Router();
/* 
router.post('/',ordenPost);
router.get('/',ordenesGet);
router.post('/',ordenPostCris);
router.post('/eliminarorden',eliminarorden);   */  

router.get('/etiqueta', (req, res) => {
  

    const orden = req.query.orden;
    const codigoP = req.query.codigoP;
    const nombreP = req.query.nombreP;
    const documentoP = req.query.documentoP;
    const fechaP = req.query.fechaP;
    console.log(fechaP,"llegamos")
    const fechaOriginal = fechaP;
  const fecha = new Date(fechaOriginal);
  
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses se indexan desde 0
  const dia = String(fecha.getDate()).padStart(2, '0');
  
  const fechaFormateada = `${dia}-${mes}-${anio}`;
  
    // Luego, pasa estas variables de contexto a la vista 'etiqueta.pug'
    res.render('etiqueta', {
      numeroOrden: orden,
      codigoPersona: codigoP,
      nombre: nombreP,
      documentoPaciente: documentoP,
      fechaHora: fechaFormateada
    });
  });
router.get('/',async (req, res) => {
  const ordenes=await getOrdenes(['Informada','Esperando toma de muestra','Analitica']);
  res.render("administrativo/listaOrdenes",{ordenes}) // Para Probar la pagina inicioOrdemn
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

