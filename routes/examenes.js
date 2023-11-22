const{Router}=require('express');
const {examenesGet,examenPost, tieneOrden,crearorden,cargarmuestras,eliminarorden,eliminadoLogico}=require('../controllers/examenes');

const router=Router();


router.get('/',examenesGet);
router.post('/',examenPost);  // Viene con el Id de Tipo De Muestra
router.get('/tieneorden/:id',tieneOrden);
router.get('/crearorden',crearorden);
router.post('/cargarmuestras',cargarmuestras);
router.get('/eliminarorden',eliminarorden);
router.post('/eliminadoLogico',eliminadoLogico);




   

module.exports = router;