const emailExiste= async(correo="" , f=true)=>{
    const existeEmail=await Usuario.findOne({correo});
    if(existeEmail && f)
        throw new Error(`El correo ${correo} ya existep en la DB`);
    
    
    if(existeEmail && !f){
        console.log(existeEmail);
        return existeEmail
    }
      
}


module.exports={emailExiste}