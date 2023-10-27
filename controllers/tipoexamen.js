const {TipoExamen}=require("../models")


const tipoExamenesGet=async()=>{
try {
    const te=  await TipoExamen.findAll();
    return te
      //return res.status(200).json(det);
} catch (error) {
    //return res.status(500).json({ error: 'No se pudieron obtener a le determinacion' });
    return {error}
}


}

module.exports={
   tipoExamenesGet
}
