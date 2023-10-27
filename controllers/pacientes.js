const { Op} = require('sequelize');


const {Usuario,Rol,UsuarioRol}=require('../models');

   





const buscarPacientes = async( termino = '', res = response ) => {
try
{      
    const pacientes = await Usuario.findAll({
        include: [ { model: Rol, through: UsuarioRol, where: { nombre: 'Paciente' }}],
        where: { [Op.or]: [ { documento: { [Op.regexp]: termino } },
                            { email: { [Op.regexp]: termino } },
                            { apellido: { [Op.regexp]: termino } }]
               },
        attributes: { exclude: ['contrasena'] }       
      });

    
    return res.render('inicioAdmin',{ok:true,pacientes,modal:"false",errors:{}})
}
catch(err){
  return res.render('inicioAdmin',{ok:false,pacientes:null,modal:"Error al buscar paciente."})
}
}



///////////////////////////////////////////

const buscar=(req,res=response)=>{

//localhost:3000/buscar/documento||email||apellido
if(!req.params.termino) return res.render('inicioAdmin',{ok:false,pacientes:null,modal:"Error al buscar paciente.",errors:{}})

const{termino}=req.params;
buscarPacientes(termino, res);
  
}


////////////////////////////////////////////

const actualizar=async(req,res)=>{
    
    
    const{documento,genero,email,nombre,apellido,fechaNacimiento,telefono,direccion,embarazo}=req.body;// acá tengo el nuevo objeto, con las propiedades que quieren modificar
   
    let cantidad=0;
 try{
 const usuario = await Usuario.findOne({
    where: { documento }
  });

  if (usuario) {
      cantidad=await usuario.update({
      documento,genero,email,nombre,apellido,fechaNacimiento,telefono,direccion,embarazo
    });
    if(cantidad!=0){
        return res.render("inicioAdmin",{pacientes:null,modal:"El paciente ha sido Actualizado",errors:{}})
    }
       
  }


} catch (e) {
    return res.render('inicioAdmin',{ok:false,pacientes:null,modal:"Error al actualizar paciente.",errors:{}})

   };

}

module.exports={
   buscar,actualizar
}