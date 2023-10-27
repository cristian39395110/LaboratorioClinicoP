const {Usuario}=require('../../models');

const emailExiste= async(email="" )=>{
    const existeEmail=await Usuario.findOne({
        where: { email }
      });
    if(existeEmail){
        
        throw new Error(`El correo ${email} ya existe en la DB`);
    }
    
    if(existeEmail ){
        console.log(existeEmail);
        return existeEmail
    }
      
}

module.exports={
    emailExiste,
}
