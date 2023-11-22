const { detValorRef } = require("../controllers/funciones/validaciones");
const { detGet} = require('../controllers/determinaciones');
const { tipoExamenesGet } = require('../controllers/tipoexamen');
const { tipoMuestrasGet } = require('../controllers/muestras');
const { ValorReferencia} = require("../models");




    const procesarBody2 =async(req,res,next) => {

  
    const {determinacion,determinacionId}=req.body
        function procesar( arr, sex, obj){
        const propH = [`${sex}BodyedadMin`, `${sex}BodyedadMax`, `${sex}BodyvalorMinimo`, `${sex}BodyvalorMaximo`];
        if (req.body[`${sex}BodyedadMin`]) {
          if (Array.isArray(req.body[`${sex}BodyedadMin`])) {
                       function parsear(prop,f){
                                req.body[prop] = req.body[prop].map(elem => {
                                  const p = f(elem)
                                  if (isNaN(p)) {
                                    if (!obj[`error${sex}NaN`]) {
                                      obj[`error${sex}NaN`] = true
                                    
                                    }
                                    return elem
                                  }
                                  return p
                                })
                                 }
                    for (let prop of propH) {
                      if(prop===`${sex}BodyedadMin` || prop===`${sex}BodyedadMax`)
                         parsear(prop,parseInt);
                      else parsear(prop,parseFloat)  
                    }
                    for (let i = 0; i < req.body[`${sex}BodyedadMax`].length; i++) {
                      arr[i] = []
                      for (let j = 0; j < 4; j++) {
                        arr[i].push(req.body[propH[j]][i])
                      }
                      detValorRef(arr, sex, obj, 0);
                    }
                  
                  }
          else {
            arr[0] = []
            let p=parseInt(req.body[`${sex}BodyedadMin`])
            if(isNaN(p)){
                arr[0].push(req.body[`${sex}BodyedadMin`]);
                if (!obj[`error${sex}NaN`]) {
                  obj[`error${sex}NaN`] = true
      
                }
              }
            else arr[0].push(p) 
            
            
            p=parseInt(req.body[`${sex}BodyedadMax`])
            if(isNaN(p)){
                arr[0].push(req.body[`${sex}BodyedadMax`]);
                if (!obj[`error${sex}NaN`]) {
                  obj[`error${sex}NaN`] = true
      
                }
              }
            else arr[0].push(p) 
      
            
            p=parseInt(req.body[`${sex}BodyvalorMinimo`])
            if(isNaN(p)){
                arr[0].push(req.body[`${sex}BodyvalorMinimo`]);
                if (!obj[`error${sex}NaN`]) {
                  obj[`error${sex}NaN`] = true
      
                }}
            else arr[0].push(p) 
      
            
            p=parseInt(req.body[`${sex}BodyvalorMaximo`])
            if(isNaN(p)){
                arr[0].push(req.body[`${sex}BodyvalorMaximo`]);
                if (!obj[`error${sex}NaN`]) {
                  obj[`error${sex}NaN`] = true
      
                }}
            else arr[0].push(p) 
      
            
            detValorRef(arr, sex, obj, 0);
          }
      
      
        }
      
        }

          
        const obj2 = { hombre: [], mujer: [], embarazada: [] }  //son los  valores        existentes      
        const obj3 = { hombre: [], mujer: [], embarazada: [] }
        const arr=['dbhombre','dbmujer','dbembarazada']
      


  
        procesar( obj3.hombre, 'hombre', obj3)
        procesar( obj3.mujer, 'mujer', obj3)
        procesar( obj3.embarazada, 'embarazada', obj3)
        const obj={hombre:[...obj3.hombre],mujer:[...obj3.mujer],embarazada:[...obj3.embarazada]};  


        for(let n of arr) {
          if(req.body[n]){
            if(Array.isArray(req.body[n])){ 
                        for(id of req.body[n]) {
                          const arr=[];
                          if(!req.body[`${n}-${id}`])
                            ValorReferencia.destroy({where:{id}})
                          else{
                            arr.push(parseInt(req.body[`${n}-${id}`][0]));
                            arr.push(parseInt(req.body[`${n}-${id}`][1]));
                            arr.push(parseFloat(req.body[`${n}-${id}`][2]));
                            arr.push(parseFloat(req.body[`${n}-${id}`][3]));
                            obj3[`${n.substring(2)}`].push(arr);
                            detValorRef(obj3[`${n.substring(2)}`], `${n.substring(2)}`, obj3, 0);
                            //arr.push(id)
                            obj2[`${n.substring(2)}`].push(arr);
                           // obj2[`${n.substring(2)}`].push(id);
                          }
                        }
              }
              else{
                const arr=[];
                if(!req.body[`${n}-${req.body[n]}`])
                  ValorReferencia.destroy({where:{id:parseInt(req.body[n])}})
                else{
                  arr.push(parseInt(req.body[`${n}-${req.body[n]}`][0]));
                  arr.push(parseInt(req.body[`${n}-${req.body[n]}`][1]));
                  arr.push(parseFloat(req.body[`${n}-${req.body[n]}`][2]));
                  arr.push(parseFloat(req.body[`${n}-${req.body[n]}`][3]));
                  obj3[`${n.substring(2)}`].push(arr);
                  detValorRef(obj3[`${n.substring(2)}`], `${n.substring(2)}`, obj3, 0);
                  //arr.push(req.body[n])
                  obj2[`${n.substring(2)}`].push(arr);
              }
        }
      }
    }
        if (Object.keys(obj3).length > 3) {
          //los rangos se solapan errorhombre0,errormujer0,errormujer0

          
          const idsRef={ hombre: Array.isArray(req.body.dbhombre)?req.body.dbhombre:[req.body.dbhombre], 
                         mujer: Array.isArray(req.body.dbmujer)?req.body.dbmujer:[req.body.dbmujer],  
                         embarazada:Array.isArray(req.body.dbembarazada)?req.body.dbembarazada:[req.body.dbembarazada]  
                        }//arreglos con los id
        
          let arrDet = await detGet();
          return res.render('tecnicoBioq/addRef2', { arrDet, obj,obj2:{determinacion,met:"post",idsRef,obj:obj2,obj3},determinacionId })
        }
        else {
            
        req.obj1=obj
        req.obj2=obj2
            next()
          }
      }
      

module.exports = { procesarBody2 };