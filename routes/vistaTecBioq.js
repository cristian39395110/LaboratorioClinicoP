const { Router } = require('express');
const { check } = require('express-validator');
const{getOrdenPacientePorIdes } = require('../controllers/orden');
const { detGet, detPost, detGetTodas, activarDeterminacion, desactivarDeterminacion } = require('../controllers/determinaciones');
const { tipoMuestrasGet, postMuestra, getVistaMuestra, activarMuestra, desactivarMuestra, muestrasGetTodos } = require('../controllers/muestras');
const router = Router();
const { ValorReferencia,Auditoria,Orden,Resultados} = require("../models");
const { tipoExamenesGet } = require('../controllers/tipoexamen');
const { llenarResultadoso } = require('../controllers/resultados');
const { getOrdenes } = require('../controllers/orden');
const { tieneOrden, examenesGet, examenPost, putExamen, activarExamen, examenesGetTodos, desactivarExamen } = require('../controllers/examenes');
const { postValorRef, refGetTodos, activarRef, desactivarRef, crearArregloValorRefyId } = require('../controllers/valorreferencia');
const {  procesarBody2 } = require('../middlewares/formExamen');
const { validarCampos0 } = require('../middlewares/validar-campos');
const { detValorRef } = require('../controllers/funciones/validaciones');


router.get('/inicio', async (req, res) => { 
  const soyAdministrativo=req.usuario.Rols.some(element => element.nombre==='Administrativo')
  const ordenes=await getOrdenes(['Informada','Esperando toma de muestra','Analitica']);
    



  res.render("tecnicoBioq/inicio", { modal: true ,soyAdministrativo,ordenes}) })


router.get('/addet', async (req, res) => {
  return res.render("tecnicoBioq/formdeterminacion", { modal: false })
})
//-----------------------------------------------------------------------------------------------------------------

router.get('/llenarResultados', async (req, res) => {
  const parametroRecibido=req.query.ordenId;


      const orde = await getOrdenPacientePorIdes( parametroRecibido);

      const ordenes=[];
      const result=[];
      let i =0;
      const exam=[];
 

 orde.ExamenOrdens.forEach(examen=>{
exam.push(examen);

});
res.render('tecnicoBioq/prueba',{result,ordenes,orde,exam});
});

//-------------------------------------------------------------------------------------------
router.post('/ingresarResultados', async function(req, res) {
  const Resultados = req.body.resultados; // Accede al array de resultados desde req.body
  const determinacionIds = req.body.determinacionId; // Accede al array de IDs de determinaciones desde req.body
  const ordenId = req.body.ordenId; // Accede al ID de la orden desde req.body
console.log(req.body,"req.body");  
console.log(ordenId,"orden");
console.log(determinacionIds,"determinacionIds");
console.log(Resultados,"Resultados");
  
  for (let i = 0; i < Resultados.length; i++) {
   
    
    await llenarResultadoso(ordenId, determinacionIds[i], Resultados[i]);
    
  }

 
  res.send('Resultados ingresados correctamente');
});

//------------------------------------------------------------------------------------------------------------------------------------------
router.get('/activarDeterminacion', async (req, res) => {
  const determinaciones = await detGetTodas()
  res.render('tecnicoBioq/activarDeter', { determinaciones })
})



router.get('/addValorRef', async (req, res) => {
  let arrDet = await detGet();
  res.render('tecnicoBioq/addReferencia', { arrDet, modal: false })
})


router.get('/activarRef', async (req, res) => {
  let arrRef2 = await refGetTodos();
  const arrRef=[];
  for(ref of arrRef2){
           if(ref.deletedAt){
                      const obj={ hombre: [], mujer: [], embarazada: [] };
                      await crearArregloValorRefyId(ref.determinacionId,obj) 
                      const arr=[ref.edadMin,ref.edadMax,ref.valorMinimo,ref.valorMaximo]
                      switch(ref.sexo){
                        case 'M':obj.hombre.push(arr);
                                 detValorRef(obj['hombre'],'hombre', obj, 0);
                                 break;
                        case 'F': ref.embarazo?obj.embarazada.push(arr):obj.mujer.push(arr);
                                  if(ref.embarazo)
                                     detValorRef(obj['embarazada'],'embarazada', obj, 0);
                                  else
                                  detValorRef(obj['mujer'],'mujer', obj, 0);  
                      }
                      if (!(Object.keys(obj).length > 3))
                          arrRef.push(ref)
                 }
           else arrRef.push(ref)
  }
  res.render('tecnicoBioq/activarRef', { arrRef })
})
router.get('/activarMuestra', async (req, res) => {
  let muestras = await muestrasGetTodos();
  res.render('tecnicoBioq/activarMuestra', { muestras, modal: false })
})
router.get('/activarExamen',async (req, res) => {
  let examenes = await examenesGetTodos();
  res.render('tecnicoBioq/activarExamen', { examenes, modal: false })
})
router.post('/activarExamen', activarExamen)
router.post('/desactivarExamen', desactivarExamen)
router.post('/activarMuestra', activarMuestra)
router.post('/desactivarMuestra', desactivarMuestra)
router.post('/activarRef', activarRef)
router.post('/desactivarRef', desactivarRef)
router.post('/desactivarDeterminacion', desactivarDeterminacion)
router.post('/activarDeterminacion', activarDeterminacion)
router.post('/addMuestra', postMuestra)
router.post('/addValorRef', [
  check('sexo').notEmpty().withMessage('Valor requerido.').isIn(['F', 'M', 'O']).withMessage('Valor inválido'),
  check('embarazo').notEmpty().withMessage('Valor requerido.').isIn(['true', 'false']).withMessage('Valor inválido'),
  check('determinacionId').notEmpty().withMessage('Valor requerido.').isNumeric(),
  check('determinacion').notEmpty().withMessage('Valor requerido.'),
  check('edadMin').notEmpty().withMessage('Valor requerido.').isInt().withMessage('Valor inválido.'),
  check('edadMax').notEmpty().withMessage('Valor requerido.').isInt().withMessage('Valor inválido.'),
  check('valorMinimo').notEmpty().withMessage('Valor requerido.').isDecimal().withMessage('Valor inválido.'),
  check('valorMaximo').notEmpty().withMessage('Valor requerido.').isDecimal().withMessage('Valor inválido.'),
  async (req, res, next) => {
    let arrDet = await detGet();
    req.renderizar = (errors) => {
      res.render('tecnicoBioq/addReferencia', { arrDet, modal: false, errors, opc: req.body })
    }
    next();
  },
  validarCampos0],
  postValorRef)



 

router.get('/addValorRef2', async (req, res) => {
  const {determinacionId,determinacion}=req.query  
  if(determinacionId){
    const obj={ hombre: [], mujer: [], embarazada: [] };
    const idsRef={ hombre: [], mujer: [], embarazada: [] }

    await crearArregloValorRefyId(determinacionId,obj,idsRef)
    let arrDet = await detGet();
    
    return res.render('tecnicoBioq/addRef2', { arrDet,obj2:{met:"post",idsRef,obj,determinacion},determinacionId })
  }
  

  let arrDet = await detGet();
  return res.render('tecnicoBioq/addRef2', { arrDet,obj2:{met:"get",determinacionId} })
})







router.post('/addValorRef2', [
  procesarBody2,
  check('determinacionId').notEmpty().withMessage('Valor requerido.'),
  async (req, res, next) => {
    let arrDet = await detGet();
    req.renderizar = (errors) => {
      return res.render('tecnicoBioq/addRef2', { obj2:{met:"post",determinacionId:req.determinacionId,idRef:[]},arrDet, errors, obj: req.obj })
    }
    next();
  },
  validarCampos0
], async (req, res) => {
  const {determinacionId}=req.body;
  const arr=['hombre','mujer','embarazada']
  
  if(req.obj1){
    for(let elem of arr){
      if(req.obj1[elem]){      
        for(let valores of req.obj1[elem]){
         const vrCreado=await ValorReferencia.create({determinacionId,edadMin:valores[0],edadMax:valores[1],sexo:elem==='hombre'?'M':'F',embarazo:elem==='embarazada',valorMinimo:valores[2],valorMaximo:valores[3]});
         
        await Auditoria.create({usuarioId:req.usuario.id,tablaAfectada:'usuarios',operacion:'insert',detalleAnterior:JSON.stringify(vrCreado._previousDataValues),detalleNuevo:JSON.stringify(vrCreado.dataValues)})
        }
      }}
   
  }
  if(req.obj2){

    for(let elem of arr){

      if(req.obj2[elem]){     
        for(let valores of req.obj2[elem]){
         await ValorReferencia.update({edadMin:valores[0],edadMax:valores[1],sexo:elem==='hombre'?'M':'F',embarazo:elem==='embarazada',valorMinimo:valores[2],valorMaximo:valores[3]},
                                     { where: { id: parseInt(valores[4])} });
        }
      }
    }
  }
  



  let arrDet = await detGet();
  return res.render('tecnicoBioq/inicio')
})





router.get('/addMuestra', getVistaMuestra)

router.put('/editar',  putExamen)




router.post('/edit', async (req, res) => {
  try {
    const examen = JSON.parse(req.body.examen)
    const obj = { id: examen.id, eNombre: examen.nombre, muestras: examen.tipoMuestraId, detalle: examen.detalle, tipoExamen: examen.tipoExamenId, demora: examen.demora }
    let dets = []
    if (examen.Determinacions) {
      dets = examen.Determinacions.map(elem => elem.id)
      obj.detExistentes = dets;
    }
    let arrDet = await detGet();
    let arrMuestras = await tipoMuestrasGet();
    let arrTe = await tipoExamenesGet();
    return res.render("tecnicoBioq/formExamen", { arrDet, arrMuestras, arrTe, modal: false, form: obj, ruta: "editar?_method=put" })
  }
  catch (err) {
    res.json({ err })//TODO: cambiar
  }

})


router.post('/addet', detPost)
router.get('/formExamen', async (req, res) => {
  let arrDet = await detGet();
  let arrMuestras = await tipoMuestrasGet();
  let arrTe = await tipoExamenesGet();
  return res.render("tecnicoBioq/formExamen", { arrDet, arrMuestras, arrTe, modal: false, form: null, ruta: '/submit' })
})
router.get('/actualizar', async (req, res) => {
  const { ok, examenes } = await examenesGet();

  res.render('tecnicoBioq/actualizarExamen', { examenes })
})

router.put('/actualizar/:id', 
  async (req, res) => {
    const { id } = req.id;
    const rta = await tieneOrden(id)
  })





router.post('/submit',  examenPost)


module.exports = router