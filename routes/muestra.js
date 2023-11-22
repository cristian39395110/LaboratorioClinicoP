const{Router}=require('express');
const{getes, muestrasGetPorOrdenTrabajoId}=require('../controllers/muestras');
//const {muestraorden}=require('../controllers/examenordenes');

const router=Router();


router.get('/muestrasGetPorOrdenTrabajoId',muestrasGetPorOrdenTrabajoId);

//router.get('/',muestraorden);

module.exports=router;

