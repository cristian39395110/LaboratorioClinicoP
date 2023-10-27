


const esAdminRol=async(req,res,next)=>{
   const roles = await req.usuario.getRols();
   let t=true;
   for(let rol of roles){
         if(rol.nombre==='Administrativo'){
            t=false;
            break;
         }
            
   }
if(t) return res.status(401).json({
          msg:`${nombre} no es un administrador, sólo los administradores pueden eliminar.`
       })   
next();
}




module.exports={
   esAdminRol
}