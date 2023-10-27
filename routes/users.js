const{Router}=require('express');
const { userPost}=require('../controllers/users');
const { check } = require('express-validator');
const{validarCampos2,validarJWT, esAdminRol} = require('../middlewares');
const { emailExiste } = require('../controllers/funciones/validaciones');

const router=Router();

router.post('/',[
    validarJWT,
    esAdminRol,
    check('nombre','introduzca caracteres válidos , por favor').matches(/^[A-ZÁ-ÚÄ-ÜÑ]+( [A-ZÁ-ÚÄ-ÜÑ]+)*$/),
    check('apellido','Introduzca caracteres válidos , por favor').matches(/^[A-ZÁ-ÚÄ-ÜÑ]+( [A-ZÁ-ÚÄ-ÜÑ]+)*$/).notEmpty(),
    check('documento','Sólo permitimos documentos de 7-9 dígitos.').notEmpty().matches(/^\d{7,9}$/),
    //check('fechaNacimiento').notEmpty().isDate(),
    check('genero').notEmpty().isIn(['Otro', 'Femenino', 'Masculino']),
    check('telefono'),
    check('direccion').isString().notEmpty(),
    check('email',"El correo no es válido").isEmail(),
    check('email').custom(emailExiste),
    check('embarazo').isBoolean(),
    check('rol').notEmpty().isIn(['Paciente', 'Administrativo', 'Tecnico','Bioquimico']),
    validarCampos2
]
,userPost);


router.get('/inicio'
,(req,res)=>{
    const token = req.header("token"); 
    res.cookie('token', token);
    res.redirect("/pacientes/home")
})




module.exports=router;
