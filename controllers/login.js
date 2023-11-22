
const Sequelize = require('sequelize');
const bcryptjs=require('bcryptjs');

const {Usuario,Rol}=require("../models")
const { generarJWT } = require('./funciones/jwt');







const login=async(req,res=response)=>{
  
  
    if(!req.body.email)
       return res.render("index",{pass:"",email:""})
   const{email,contrasena,nombreRol}=req.body;
       try{
           const usuario = await Usuario.findOne({
               where: {  [Sequelize.Op.or]: [ { email }, { documento:email } ] },
               include: [
                 {
                   model: Rol,
                   where: { nombre:nombreRol } 
                 }
               ]
             });
         if(!usuario)return res.render("index",{email:"Usuario o rol incorrecto.",pass:"",passValue:contrasena,emailValue:email,rol:nombreRol})
        
        const passValida=await bcryptjs.compare(contrasena,usuario.contrasena);
        if(!passValida) return res.render("index",{email:"",pass:"Contraseña incorrecta.",passValue:contrasena,emailValue:email,rol:nombreRol});   
       
        const token=await generarJWT(usuario.id);
        req.session.token = token;
        switch(nombreRol){
          case "Paciente": return res.redirect(`/pacientes`);
          case "Administrativo":return res.redirect(`/vistaAdmin/inicio`);
          case "Tecnico":return res.redirect(`/vistaTecBioq/inicio`);
          case "Bioquimico":return res.redirect(`/vistaTecBioq/inicio`);
        }
       
       }
       catch(error){
        console.log(error);
           return res.status(500).render("error",{error})
       }
     
   }


   const salir=(req,res)=>{
    req.session.token = null;
    res.render('index'); 
   }
   



module.exports={login,salir} 




