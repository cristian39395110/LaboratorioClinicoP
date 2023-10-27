const {validationResult}=require('express-validator');

const validarCampos=(req,res,next)=>{
    const {errors}=validationResult(req);
    if(!(errors.length===0)){        
            if(errors[0].path==="email")
                return(res.render("index",{email:errors[0].msg,pass:"",emailValue:errors[0].value,passValue:errors[0].value}))
            
            
            return(res.render("index",{email:"",pass:errors[0].msg,emailValue:errors[0].value,passValue:errors[0].value}))
        
    }
       
    next() ;
}



const validarCampos2=(req,res,next)=>{
    console.log("entro");
    const result=validationResult(req);
   
    
    const objeto={}
    for(obj of result.errors){
          objeto[obj.path]=obj.msg;
    }
      console.log(objeto);
      if (!result.isEmpty()) {
        req.session.errorsInsertar = objeto;
        const {nombre,apellido,documento,genero,telefono,direccion,email,embarazo}=req.body;

        req.session.valoresForm={nombre,apellido,documento,genero,telefono,direccion,email,embarazo};
        console.log("calores del dormulario  ",req.session.valoresForm);
        return res.redirect('/admins');
      }
    next() ;  
}


module.exports={validarCampos,validarCampos2};