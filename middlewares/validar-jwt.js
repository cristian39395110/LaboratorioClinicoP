const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const {Rol,Usuario} = require('../models');


const validarJWT = async( req = request, res = response, next ) => {
   const token = req.session.token;

    try {
        
        const { id } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
       const usuario = await Usuario.findByPk(id,{include:{model:Rol}});

        if( !usuario ) {
            return res.status(401).send({
                msg: 'Token no válido - usuario no existe DB'
            })
        }
        
        req.usuario = usuario;
        req.token=token;
        next();

    } catch (error) {
        console.log({error});
        return  res.redirect("/")
    }

}




module.exports = {
    validarJWT
}
