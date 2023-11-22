
const { Router } = require('express');

const bcryptjs=require('bcryptjs');
const { check } = require('express-validator');
const { compararPass, nuevaPassCheck } = require("../controllers/funciones/validaciones");
const { validarCampos0 } = require('../middlewares');
const {Usuario}=require('../models');
const router = Router();



router.get('/',
   (req,res)=>{

  return res.render(req.query.render!=="cambiarPass"?`${req.query.render}/cambiarPass`:'cambiarPass' ,{nav:req.query.render})
})


router.put('/',[
  check('passActual').notEmpty().withMessage('Valor requerido.').custom(compararPass),
  check('nuevaPass').notEmpty().withMessage('Valor requerido.').custom(nuevaPassCheck),
  check('nuevaPass2').notEmpty().withMessage('Valor requerido.'),
  async (req, res, next) => {
    req.renderizar = (errors) => {
      res.render(`${req.query.render}/cambiarPass`,{errors,opc:req.body})
    }
    next();
  },
validarCampos0],
(req,res)=>{
  const salt=bcryptjs.genSaltSync();
  const contrasena=bcryptjs.hashSync(req.body.nuevaPass,salt);
  Usuario.update({contrasena},{where:{id:req.usuario.id}})
  res.redirect('/')
}
)


module.exports=router