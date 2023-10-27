const{Router}=require('express');
const { detGet, detPost, detGetTodas,activarDeterminacion, desactivarDeterminacion } = require('../controllers/determinaciones');
const { tipoMuestrasGet, postMuestra, getVistaMuestra, activarMuestra, desactivarMuestra } = require('../controllers/muestras');
const router=Router();
const {Determinacion,Examen,TipoMuestra,TipoExamen,ValorReferencia}=require("../models");
const { tipoExamenesGet } = require('../controllers/tipoexamen');
const { tieneOrden, examenesGet } = require('../controllers/examenes');
const { postValorRef, refGetTodos, activarRef, desactivarRef } = require('../controllers/valorreferencia');


router.get('/inicio',(req,res)=>{res.render("tecnicoBioq/inicio")})
//router.get('/inicio',(req,res)=>{res.render("inicioAdmin2/inicioAdmin2")})
router.get('/addet',async(req,res)=>{
            return res.render("tecnicoBioq/formdeterminacion",{modal:false})})





router.get('/activarDeterminacion',async(req,res)=>{
        console.log("lala");
        const determinaciones=await detGetTodas()
          res.render('tecnicoBioq/activarDeter',{determinaciones})
      })  
      


      router.get('/addValorRef',async(req,res)=>{
        let arrDet= await detGet();
        res.render('tecnicoBioq/addReferencia',{arrDet,modal:false})
     })
     router.get('/activarRef',async(req,res)=>{
      let arrRef=await refGetTodos();
      res.render('tecnicoBioq/activarRef',{arrRef})
     })
     router.post('/activarMuestra',activarMuestra)
     router.post('/desactivarMuestra',desactivarMuestra)
     router.post('/activarRef',activarRef)
     router.post('/desactivarRef',desactivarRef)
     router.post('/desactivarDeterminacion',desactivarDeterminacion)
     router.post('/activarDeterminacion',activarDeterminacion)
      router.post('/addMuestra',postMuestra)
      router.post('/addValorRef',postValorRef)
      router.post('/addRef',postValorRef)
      router.get('/addMuestra',getVistaMuestra)
router.post('/edit',async(req,res)=>{
  try{
    
    const examen=JSON.parse(req.body.examen)
    console.log("zzzzzzzzzz", examen);
    let arrTe= await tipoExamenesGet();
    let arrMuestras= await tipoMuestrasGet();
    console.log("TIPO EXAMEN",arrTe);
    console.log(arrMuestras);
    res.render("tecnicoBioq/editExamen",{examen,arrTe,arrMuestras});
  }
  catch(err){
    res.json({err})
  }
  
})


router.post('/addet',detPost)            
router.get('/formExamen',async(req,res)=>{
    let arrDet= await detGet();
    let arrMuestras= await tipoMuestrasGet();
    
    let arrTe= await tipoExamenesGet();
   return res.render("tecnicoBioq/formExamen",{arrDet,arrMuestras,arrTe})})

  router.get('/actualizar',async(req,res)=>{
           const {ok,examenes}=await examenesGet();

    res.render('tecnicoBioq/actualizarExamen',{examenes})
  })

router.put('/actualizar/:id',async(req,res)=>{
         const{id}=req.id;
         const rta=await tieneOrden(id)
})





   router.post('/submit',async(req,res)=>{
    console.log("---------------------------------------------------------");
    console.log(req.body);
    console.log(req.body.eNombre);
    const examen=await Examen.create({nombre:req.body.eNombre,detalle:req.body.detalle});

     for(let muestra of req.body.muestras){
                const m=await TipoMuestra.findByPk(muestra)
                 m.addExamen(examen)
     }

     for(let teId of req.body.tipoExamen){
        const te=await TipoExamen.findByPk(teId)
         te.addExamen(examen)
}



    const determinacionesNombre=[]
    for (const propiedad in req.body) {
        if (propiedad.startsWith("nombre")) {
          determinacionesNombre.push(propiedad);
        }
      }
      

    const determinaciones=determinacionesNombre.map(nom=>{
        const obj={hombre:{},mujer:{},embarazada:{}}  
        const det={}
        const[,b]=nom.split("y");
        det.nombre=req.body[nom];
        det.valorMin=req.body[`valorMiny${b}`]
        det.valorMax=req.body[`valorMaxy${b}`];        
        det.unidadMedida=req.body[`unidadMediday${b}`];
        obj.determinacion=det;
        
        const valoresRefHombre=[];
        const valoresRefMujer=[];
        const valoresRefEmbarazada=[];
        for (const propiedad in req.body) {
            if (propiedad.startsWith("Hombre") && propiedad.endsWith(b)) {
              valoresRefHombre.push(req.body[propiedad]);
            }else if (propiedad.startsWith("Mujer") && propiedad.endsWith(b)) {
                valoresRefMujer.push(req.body[propiedad]);
              }else if (propiedad.startsWith("Embarazada") && propiedad.endsWith(b)) {
                valoresRefEmbarazada.push(req.body[propiedad]);
              }
          }
          console.log(valoresRefHombre);
        obj.hombre=valoresRefHombre;
        obj.mujer=valoresRefMujer;
        obj.embarazada=valoresRefEmbarazada;       

    
        return obj
    })

  console.log("DETERMINACIONESS ",determinaciones);
    for(let obj of determinaciones){
        const det=await Determinacion.create({nombre:obj.determinacion.nombre,unidadMedida:obj.determinacion.unidadMedida,valorMin:obj.determinacion.valorMin,valorMax:obj.determinacion.valorMax,comentarios:""});
        await examen.addDeterminacion(det)
        if(obj.hombre){
              for(let fila of obj.hombre){
                const vr=await ValorReferencia.create({determinacionId:det.id,edadMin:fila[0],edadMax:fila[1],sexo:'H',embarazo:false,valorMinimo:fila[2],valorMaximo:fila[3]});
                await det.addValorReferencia(vr)
              }
        }
        if(obj.mujer){
            for(let fila of obj.mujer){
              const vr=await ValorReferencia.create({determinacionId:det.id,edadMin:fila[0],edadMax:fila[1],sexo:'F',embarazo:false,valorMinimo:fila[2],valorMaximo:fila[3]});
              await det.addValorReferencia(vr)
            }
      }
      if(obj.embarazada){
        for(let fila of obj.mujer){
          const vr=await ValorReferencia.create({determinacionId:det.id,edadMin:fila[0],edadMax:fila[1],sexo:'F',embarazo:true,valorMinimo:fila[2],valorMaximo:fila[3]});
          await det.addValorReferencia(vr)
        }
  }
        
    }

   if(req.body.detExistentes){

   }

   return res.render("tecnicoBioq/inicio")

})
module.exports=router