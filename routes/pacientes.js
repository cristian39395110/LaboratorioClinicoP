const{Router}=require('express');
const { check } = require('express-validator');
const{validarCampos,tieneRole,validarJWT} = require('../middlewares');
const { buscar,actualizar } = require('../controllers/pacientes');

const router=Router();


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
