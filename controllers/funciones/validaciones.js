const { Usuario } = require('../../models');
const bcryptjs=require('bcryptjs');

const emailExiste = async (email = "") => {
    const existeEmail = await Usuario.findOne({
        where: { email }
    });
    if (existeEmail) {

        throw new Error(`El correo ${email} ya existe en la DB`);
    }

    if (existeEmail) {
        return existeEmail
    }

}




const detValorRef = (arrValoresRef, de,obj,v) => {
    console.log("---------------------------------");
    console.log(arrValoresRef,de);
    let msg=""
    const i = arrValoresRef.length
    if(i==1 && !( (arrValoresRef[i-1][0]<arrValoresRef[i-1][1]) && 
                  (arrValoresRef[i-1][2]<arrValoresRef[i-1][3])
          )
          ){

           
        msg= `Los rangos de valores de referencia de ${de} se solapan`
                       
    }else
     
    if (  (i > 1) &&(  ( arrValoresRef[i-1][2] < arrValoresRef[i-1][3])||
                       ( arrValoresRef[i-1][0] < arrValoresRef[i-1][1])
                       ) 
                   &&    (arrValoresRef.some((elem,index)=>{ 
                    console.log((parseInt(elem[0]) <=  parseInt(arrValoresRef[i-1][1]) ) && 
                    (parseInt(arrValoresRef[i-1][1])<=parseInt(elem[1])));
                    console.log(parseInt(elem[0])," <=  ",parseInt(arrValoresRef[i-1][1]) ," &&", 
                    parseInt(arrValoresRef[i-1][1]),"<=",parseInt(elem[1]));
                    return( i-1!=index &&(
                                                                      ( (parseInt(elem[0]) <=  parseInt(arrValoresRef[i-1][0])) && 
                                                                        (parseInt(arrValoresRef[i-1][0])<=parseInt(elem[1]))
                                                                       )|| 
                                                                     ( (parseInt(elem[0]) <=  parseInt(arrValoresRef[i-1][1]) ) && 
                                                                       (parseInt(arrValoresRef[i-1][1])<=parseInt(elem[1]))
                                                                       )||
                                                                     ( (parseInt(arrValoresRef[i-1][0]) <= parseInt(elem[0])) && 
                                                                       ( parseInt(elem[0]) <= parseInt(arrValoresRef[i-1][1])) 
                                                                       )||
                                                                     ( (parseInt(arrValoresRef[i-1][0]) <= parseInt(elem[1])) && 
                                                                       ( parseInt(elem[1]) <= parseInt(arrValoresRef[i-1][1]) ) 
                                                                       )||
                                                                     ( (parseFloat(elem[2]) <= parseFloat(arrValoresRef[i-1][2])) && 
                                                                       (parseFloat(arrValoresRef[i-1][2])<= parseFloat(elem[3]))
                                                                      )||
                                                                     ( (parseFloat(elem[2]) <= parseFloat(arrValoresRef[i-1][3])) && 
                                                                       (parseFloat(arrValoresRef[i-1][3])<= parseFloat(elem[3]))
                                                                     )||
                                                                     ( (parseFloat(arrValoresRef[i-1][2])<= parseFloat(elem[2])) && 
                                                                       (parseFloat(elem[2])<=parseFloat(arrValoresRef[i-1][3]))
                                                                       )||
                                                                     ( (parseFloat(arrValoresRef[i-1][2])<=parseFloat(elem[3])) && 
                                                                       (parseFloat(elem[3])<=parseFloat(arrValoresRef[i-1][3]))
                                                                       )
                                                                    )
                                                                   )
                                                        }
                                          )
                        )
                    
         ) {

       
        msg=`Los rangos  se solapan.`
    }
    if(msg) {
        if(!obj[`error${de}${v}`]){
            obj[`error${de}${v}`]=true
        }
    }
    return msg
}



const usuarioExiste=async(usuario,{req})=>{
        const existeUser=await Usuario.findOne({where:{documento:usuario}})
        if(!existeUser){
           throw new Error(`No hay registro del usuario.`);
        }
        else req.user=existeUser
}


const nuevaPassCheck=(value, { req }) => {
  if (value !== req.body.nuevaPass2) {
    throw new Error('Las contraseñas no coinciden.');
  }
  return true;
}

const compararPass=async(value,{req})=>{

  const passValida=await bcryptjs.compare(value,req.usuario.contrasena);
  if(!passValida){
    console.log("qq");
    throw new Error('Contraseña incorrecta.');
  }
}


module.exports = {
    emailExiste, detValorRef,usuarioExiste,nuevaPassCheck,compararPass
}


