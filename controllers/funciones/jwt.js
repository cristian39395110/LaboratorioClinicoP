const jwt=require('jsonwebtoken');
const{Usuario}=require('../../models')

const generarJWT=async(id)=>{
    return new Promise((resolve,reject)=>{
        const payload={id};
        jwt.sign(payload,
                 process.env.SECRETORPRIVATEKEY,
                 {expiresIn:'24h'},
                 (err,token)=>{
                    if(err)
                        reject('No se pudo generar el token.')
                    else resolve(token)

                 })
    })
}

const comprobarJwT=async(token="")=>{
    try {
        if(token.length<10) return null;
        const {id}=jwt.verify(token,process.env.SECRETORPRIVATEKEY);
        const usuario=await Usuario.findByPk(id);
        if(usuario) return usuario;
        else return null;
    } catch (error) {
        return null
    }
}


module.exports={generarJWT,comprobarJwT}