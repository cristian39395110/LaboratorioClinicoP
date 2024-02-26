const {Examen,OrdenTrabajo,TipoExamen,TipoMuestra,Determinacion,ExamenOrden,sequelize,ExamenDeterminacion,Auditoria}=require('../models');



const { detGet } = require('./determinaciones');
const { tipoMuestrasGet } = require('./muestras');
const { tipoExamenesGet } = require('./tipoexamen');
const {getOrdenes}=require('./orden');



const examenesGetTodos=async()=>{
  return  await Examen.findAll({paranoid:false,include:[{model:OrdenTrabajo},{model:TipoMuestra},{model:TipoExamen}]})

}



const activarExamen = async (req, res) => {
  const { id } = req.body;
  const t = await sequelize.transaction();
  try {
      await Examen.restore({ where: { id }, transaction: t });
      await ExamenOrden.restore({ where: { examenId: id }, transaction: t });
      await ExamenDeterminacion.restore({ where: { examenId: id }, transaction: t });

      // Auditoría: Registro de activación del examen
      await Auditoria.create({usuarioId:req.usuario.id,tablaAfectada:'examenes',operacion:'desactivar',detalleAnterior:JSON.stringify(examen._previousDataValues),detalleNuevo:JSON.stringify(examen.dataValues)})

      await t.commit();
      const examenes = await examenesGetTodos();
      res.render('tecnicoBioq/activarExamen', { examenes });
  } catch (error) {
      await t.rollback();
      console.error('Error al activar el examen:', error);
      res.status(500).render('error', { message: 'Error interno del servidor' });
  }
}

const desactivarExamen = async (req, res) => {
  const { id } = req.body;
  const t = await sequelize.transaction();
  try {
      await ExamenOrden.destroy({ where: { examenId: id }, transaction: t });
      await ExamenDeterminacion.destroy({ where: { examenId: id }, transaction: t });
      await Examen.destroy({ where: { id }, transaction: t });

      // Auditoría: Registro de desactivación del examen
      await Auditoria.create({usuarioId:req.usuario.id,tablaAfectada:'examenes',operacion:'desactivar',detalleAnterior:JSON.stringify(examen._previousDataValues),detalleNuevo:JSON.stringify(examen.dataValues)})

      await t.commit();
      const examenes = await examenesGetTodos();
      res.render('tecnicoBioq/activarExamen', { examenes });
  } catch (error) {
      await t.rollback();
      console.error('Error al desactivar el examen:', error);
      res.status(500).render('error', { message: 'Error interno del servidor' });
  }
}

const examenesGet= async (req,res) => {
try { 
       let examenes= await Examen.findAll({include: [{ model:OrdenTrabajo },{ model:TipoMuestra },{ model:TipoExamen },{model:Determinacion}]});
       examenes= examenes.filter(examen=>examen.OrdenTrabajos.length===0)
      return {ok:true,examenes};
} catch (error) {
    return {ok:false,error};
        
}

}   

const tieneOrden=async(req,res)=>{
    try{
        const{id}=req.params;
        const examen=await Examen.findByPk(id, 
            {include: [
                { model:OrdenTrabajo }
            ]
           }); 

        

        if(examen){
            if (examen.OrdenTrabajos.length===0) 
              return { ok:true,examen};
            else return { ok:false,examen};
        }
        else{ 
           
            return {msg:'no hay examen con ese id'};
        }

    }
    catch(error){
        console.log(error);
        return {msg:"Error en controllers/examenes/tieneOrden",error}
    }
}


const examenPost= async(req,res)=>{
 
    const t = await sequelize.transaction();
    try{
     let {eNombre,demora,detalle,muestras,tipoExamen,detExistentes}=req.body
      const examen=await Examen.create({nombre:eNombre,detalle,demora}, { transaction: t });
      await Auditoria.create({
        usuarioId: req.usuario.id,
        tablaAfectada: 'examenes',
        operacion: 'insert',
        detalleAnterior: null, // No hay detalle anterior en una inserción
        detalleNuevo: JSON.stringify(examen.dataValues)
    });
        
   
     for(let muestra of muestras){
                const m=await TipoMuestra.findByPk(muestra)
                 await m.addExamen(examen,{ transaction: t})
     }

     for(let teId of tipoExamen){
        const te=await TipoExamen.findByPk(teId)
         await te.addExamen(examen, { transaction: t })
}

   if(detExistentes){
    if(!Array.isArray(detExistentes)){
        detExistentes=[detExistentes]
    }
    for(let id of detExistentes){  
      await examen.addDeterminacion(id, { transaction: t })
    }
   }
   

   await t.commit();

   return res.render("tecnicoBioq/inicio",{modal:"Examen agregado."})
  
  }catch (error) {
    console.log(error);
    await t.rollback();

    if (error.name === 'SequelizeUniqueConstraintError')
       req.body.nombreExiste=true
       
       let arrDet= await detGet();
       let arrMuestras= await tipoMuestrasGet();
       let arrTe= await tipoExamenesGet();
   return res.render("tecnicoBioq/formExamen",{arrDet,arrMuestras,arrTe,modal:false,form:req.body,ruta:"submit"})
  }

}



//------------------------------------------------------------------

const cargarmuestras=async (req, res) => {
    const id=req.body.examen1;
   

    
try {
    const tipomues = await TipoMuestra.findOne({
        where: {
          "id": id
        }
      });
     
      return res.json(tipomues); 
} catch (error) {
    tipomues=[];
    return res.json(tipomues);
}



}
const eliminarorden=async(req,res)=>{
  const examen1 = [
      { nombre: 'Examen A', demora: 1, tipoMuestraId: 1, id: 1 },
      { nombre: 'Examen B', demora: 2, tipoMuestraId: 2, id: 2 },
      // Agrega más datos según sea necesario
    ];
  res.render('inicioOrden',{ok:false,k:false,j:true,examen1:examen1});

}








//------------------------------------------------------------------
const crearorden= async (req, res)=>{
    try {
        examen=await Examen.findAll();
        res.render('inicioOrden',{ok:false,k:true,examen1:examen}); 
    } catch (error) {
        examen=[];
        res.render('inicioOrden',{ok:false,k:true,examen1:examen}); 
    }
  

}


//-------------------------------------------------------------------------------------------
const putExamen=async(req,res)=>{
    const t = await sequelize.transaction();
    try{

      let {id,eNombre,demora,muestras,tipoExamen,detalle,detExistentes}=req.body;
    const valores={tipoMuestraId:muestras,nombre:eNombre,detalle,tipoExamenId:tipoExamen,demora}
    const examen=await Examen.findByPk(id,{include:{model:Determinacion}})
    const determinacionesExamen=examen.Determinacions;
    Examen.update(valores,{where:{id}}) 
    await Auditoria.create({
      usuarioId: req.usuario.id,
      tablaAfectada: 'examenes',
      operacion: 'update',
      detalleAnterior: JSON.stringify(examen._previousDataValues),
      detalleNuevo: JSON.stringify(examen.dataValues)
  });
    
   if(detExistentes){
    if(!Array.isArray(detExistentes)){
        detExistentes=[detExistentes]
    }
    for(let id of detExistentes){ 
      if(!determinacionesExamen.some(elem=>elem.id===parseInt(id))){
        await examen.addDeterminacion(id, { transaction: t })
      } 
      for(let id of determinacionesExamen){ 
        if(!detExistentes.some(elem=>{
          return parseInt(elem)===id.id})){
         
          await examen.removeDeterminacion(id, { transaction: t })
        } 

    }
  }
   }

   

   await t.commit();

   return res.render("tecnicoBioq/inicio",{modal:"Examen Editado"})
  
  }catch (error) {
    console.log(error);
    await t.rollback();

    if (error.name === 'SequelizeUniqueConstraintError')
       req.body.nombreExiste=true
       
       let arrDet= await detGet();
       let arrMuestras= await tipoMuestrasGet();
       let arrTe= await tipoExamenesGet();
   return res.render("tecnicoBioq/formExamen",{arrDet,arrMuestras,arrTe,modal:false,form:req.body,ruta:"submit"})
  }

}

/*
const eliminadoLogico = async (req, res) => {
    const ordenId = req.body.term;  
    
  
    try {
      // Verifica si la orden existe antes de intentar eliminarla
      const orden = await OrdenTrabajo.findOne({ where: { id: ordenId } });
  
      if (!orden) {
        return res.status(404).json({ error: 'Orden no encontrada' });
      }
  
      // Realiza la eliminación lógica marcando el campo `deletedAt`
      await OrdenTrabajo.update({ deletedAt: new Date() }, { where: { id: ordenId } });
      await Auditoria.create({usuarioId:req.usuario.id,tablaAfectada:'examenes',operacion:'update',detalleAnterior:JSON.stringify(examen._previousDataValues),detalleNuevo:JSON.stringify(examen.dataValues)})
      // Envía una respuesta exitosa
      const ordenes=await getOrdenes(['Informada','Esperando toma de muestra','Analitica']);
      res.render("administrativo/listaOrdenes",{ordenes})
    } catch (error) {
      console.error('Error al eliminar la orden:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
  };
  */
  const eliminadoLogico = async (req, res) => {
    const ordenId = req.body.term;  
    
    try {
        // Verifica si la orden existe antes de intentar eliminarla
        const orden = await OrdenTrabajo.findOne({ where: { id: ordenId } });
  
        if (!orden) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }
  
        // Realiza la eliminación lógica marcando el campo `deletedAt`
        await OrdenTrabajo.destroy({ where: { id: ordenId } });
        
        // Envía una respuesta exitosa
        const ordenes = await getOrdenes(['Informada','Esperando toma de muestra','Analitica']);
        res.render("administrativo/listaOrdenes", { ordenes });
    } catch (error) {
        console.error('Error al eliminar la orden:', error);
        return res.status(500).json({ error: 'Error en el servidor' });
    }
};


module.exports={
   examenesGet,examenPost,tieneOrden,crearorden,cargarmuestras,putExamen,eliminadoLogico,eliminarorden,activarExamen,examenesGetTodos,desactivarExamen
  }