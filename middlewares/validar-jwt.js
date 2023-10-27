const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const {Usuario} = require('../models');


const validarJWT = async( req = request, res = response, next ) => {

   console.log("FECHANACIMIENTO : ",req.body.fechaNacimiento);
   const token = req.session.token;

    try {
        
        const { id } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
       const usuario = await Usuario.findByPk(id);

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
        return  res.render("error",{error})
    }

}




module.exports = {
    validarJWT
}
