const{Router}=require('express');
const{validarJWT} = require('../middlewares')

const router=Router();


router.get('/',
    validarJWT,
    async(req,res)=>{ 

        if(req.session.errorsInsertar){
        const errors = req.session.errorsInsertar;
        req.session.errorsInsertar = null; // Limpia los errores después de mostrarlos
        const valoresForm=req.session.valoresForm;
        req.session.errorsInsertar=null;
        return res.render("inicioAdmin", { ok: false, pacientes: null, modal: false, errors,valoresForm });
          }

       return res.render('inicioAdmin',{ok:false,pacientes:null,modal:false,errors:[],valoresForm:{}});
    }
   
)


module.exports=router;
