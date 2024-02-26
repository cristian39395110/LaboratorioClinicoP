const bcryptjs=require('bcryptjs');
const { Sequelize} = require('sequelize');
const { Op } = require('sequelize');
const {Usuario,Rol,Auditoria}=require('../models');

   

const userPost = async (req, res) => {

    const t = await Usuario.sequelize.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVEL_READ_COMMITTED });
  
    try {
      
      const { nombre, apellido, documento, fechaNacimiento, genero, telefono, direccion, email, matricula,embarazo, rol } = req.body;
      const contrasena = documento;
      const usuario = await Usuario.create({contrasena,email,nombre,apellido,documento,fechaNacimiento,genero,telefono,direccion,matricula,embarazo}, { transaction: t });
      await Auditoria.create({usuarioId:req.usuario.id,tablaAfectada:'usuarios',operacion:'insert',detalleAnterior:null,detalleNuevo:JSON.stringify(usuario.dataValues)})
        
     
     
      const r = await Rol.findOne({ where: { nombre: rol } });
      if (!r) {
        await t.rollback();
        return res.status(400).json({ msg: "Error: El rol no existe." });
      }
  
      
      await usuario.addRol(r, { transaction: t });
  
      const salt=bcryptjs.genSaltSync();
      usuario.contrasena=bcryptjs.hashSync(contrasena,salt);
      await usuario.save({ transaction: t });  
      await t.commit();
       
      res.render("inicioAdmin",{ok:false,pacientes:null,modal:"El paciente ha sido registrado",errors:{}})
    } catch (err) {
      await t.rollback();
      console.log(err);
      return res.render('inicioAdmin',{ok:false,pacientes:null,modal:"Error al registrar a un paciente.",errors:{}})
    }
  };





const usersInternosGet=async()=>{
        return await Usuario.findAll({include: [ { model: Rol,where: { nombre: { [Op.not]: 'Paciente' }}}]})
}


module.exports={
   userPost,usersInternosGet
}


/*

{
    "nombre":"nombre10",
    "apellido":"apellido10", 
    "documento":"documento10",
    "fechaNacimiento":"2023-11-11",
    "genero":"Otro",
    "telefono":"telefono10",
    "direccion":"direccion10",
    "email":"email10@gmail.com",
    "rol":"Bioquimico"
}


*/
