const{Router}=require('express');
const { check } = require('express-validator');
const{validarCampos,tieneRole,validarJWT} = require('../middlewares');
const { buscar,actualizar,encontrar,verificar,buscarinout,buscarordenes,buscarpaciente,verificare } = require('../controllers/pacientes');

const router=Router();

router.get('/encontrar', encontrar);
router.post('/verificar', verificar);
router.post('/verificare', verificare);
router.get('/buscarinout', buscarinout);
router.get('/buscarordenes', buscarordenes);
router.get('/buscarpaciente', buscarpaciente);

//router.put('/:dni',actualizar);

router.put('/',actualizar);

router.get('/:termino',validarJWT,buscar);

router.get('/',
    validarJWT,
    async(req,res)=>{

    //res.render('inicioPaciente', { token: token });                                 
    res.render('inicioPaciente');
   
    }
   
)





module.exports=router;
