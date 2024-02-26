    const {ValorReferencia,Determinacion}=require('../models');
    const { detGet } = require('./determinaciones');
    const { detValorRef } = require('./funciones/validaciones');

    const valorReferenciaPost=async(req,res)=>{
        try {
            const {determinacionId,edadMin,edadMax,sexo,embarazo,valorMinimo,valorMaximo}=req.body;

            const vrCreado=await ValorReferencia.create({determinacionId,edadMin,edadMax,sexo,embarazo,valorMinimo,valorMaximo});
            console.log("//////////////////////////////////")
            console.log(vrCreado);
            await Auditoria.create({
                usuarioId: req.usuario.id,
                tablaAfectada: 'valorreferencias',
                operacion: 'insert',
                detalleAnterior: null,
                detalleNuevo: JSON.stringify(vrCreado)
            });
            return res.json({msg:"valor de referencia insertada en la DB"})
        } catch (error) {
            console.log(error);
            return res.json({msg:"Error al insertar un valor de referencia en la DB",
                            error})
        }
    }


    const postValorRef=async(req,res)=>{

        const determinacionId= parseInt(req.body.determinacionId)
        const edadMin=parseInt(req.body.edadMin)
        const edadMax=parseInt(req.body.edadMax);
        const{sexo,embarazo}=req.body
        const valorMinimo=req.body.valorMinimo;
        const valorMaximo=req.body.valorMaximo;
        
    
        
        if(  edadMin>=edadMax || valorMinimo>=(valorMaximo)) {
            let arrDet= await detGet();
            return res.render('tecnicoBioq/addReferencia',{arrDet,modal:false,errors:[{msg:"Los rangos ingresados se solapan.",path:"solapa"}],opc:{determinacionId,edadMin,edadMax,sexo,embarazo,valorMinimo,valorMaximo}})
        }

        const vr=await ValorReferencia.findAll({where:{determinacionId,sexo}})
        if(vr){
            for(valor of vr){
                if(valor.edadMax>= edadMin || valor.valorMaximo>= valorMinimo ){ 
                        let arrDet= await detGet();       
                        return res.render('tecnicoBioq/addReferencia',{arrDet,modal:false,errors:[{msg:"Los rangos ingresados se solapan con losvalores existentes.",path:"solapa",}],opc:{determinacionId,edadMin,edadMax,sexo,embarazo,valorMinimo,valorMaximo}})
                }                
            }
        }

                
        const vrCreado=await ValorReferencia.create({determinacionId: parseInt(determinacionId, 10),edadMin,edadMax,sexo,embarazo,valorMinimo,valorMaximo})
        console.log("//////////////////////////////////")
            console.log(vrCreado);
        let arrDet= await detGet();
        await Auditoria.create({
            usuarioId: req.usuario.id,
            tablaAfectada: 'valorreferencias',
            operacion: 'insert',
            detalleAnterior: null,
            detalleNuevo: JSON.stringify(vrCreado)
        });
        //await Auditoria.create({usuarioId:req.usuario.id,tablaAfectada:'valorreferencias',operacion:'insert'})
        res.render('tecnicoBioq/addReferencia',{arrDet,modal:"Valor de referencia agregado."})
    }


    const refGetTodos=async(req,res)=>{
        try {
            const valorRef = await ValorReferencia.findAll( {paranoid:false,include: [{model: Determinacion}]});
            
            return valorRef
        } catch (error) {
            console.error(error);
            return({ok:false})
        }
    }

    const activarRef=async(req,res)=>{
        const{id}=req.body; // id del valor de referencia
        const {determinacionId}=await ValorReferencia.findByPk(id,{paranoid:false, attributes: ['determinacionId']})
        console.log("---------------------------------uuuuu");
        console.log(determinacionId);

        const obj={ hombre: [], mujer: [], embarazada: [] };
    await crearArregloValorRefyId(determinacionId,obj)
    
    for (elem in obj ){
        const msg=detValorRef(obj[elem],elem, obj, 0);
        console.log(msg);
    }


        await ValorReferencia.restore({where:{id}})
        await Auditoria.create({
            usuarioId: req.usuario.id,
            tablaAfectada: 'valorreferencias',
            operacion: 'restore',
            detalleAnterior: JSON.stringify(valoresRefAntes),
            detalleNuevo: JSON.stringify(valoresRefDespues)
        });
        let arrRef=await refGetTodos();
        res.render('tecnicoBioq/activarRef',{arrRef})
    }


    const desactivarRef=async(req,res)=>{
        const{id}=req.body;

        await ValorReferencia.destroy({ where: { id } });
        await Auditoria.create({
            usuarioId: req.usuario.id,
            tablaAfectada: 'valorreferencias',
            operacion: 'desactivar',
            detalleAnterior: null,
            detalleNuevo: JSON.stringify({ id })
        });
        let arrRef=await refGetTodos();
        res.render('tecnicoBioq/activarRef',{arrRef})

    }




    const crearArregloValorRefyId=async(determinacionId,obj,idsRef={ hombre: [], mujer: [], embarazada: [] })=>{
        const determinaciones=await ValorReferencia.findAll({where:{determinacionId}}) 
        determinaciones.forEach((elem,index)=>{
        const arr=[]
        if(elem.embarazo){
            idsRef.embarazada.push(elem.id)
            arr.push(elem.edadMin);
            arr.push(elem.edadMax);
            arr.push(elem.valorMinimo);
            arr.push(elem.valorMaximo);
            obj.embarazada.push(arr)
        }else
        if(elem.sexo==='F'){
            idsRef.mujer.push(elem.id)
            arr.push(elem.edadMin);
            arr.push(elem.edadMax);
            arr.push(elem.valorMinimo);
            arr.push(elem.valorMaximo);
            obj.mujer.push(arr)
        }
        else {
            idsRef.hombre.push(elem.id)
            arr.push(elem.edadMin);
            arr.push(elem.edadMax);
            arr.push(elem.valorMinimo);
            arr.push(elem.valorMaximo);
            obj.hombre.push(arr)
        }
        })
    }



module.exports={valorReferenciaPost,postValorRef,refGetTodos,activarRef,desactivarRef,crearArregloValorRefyId}


