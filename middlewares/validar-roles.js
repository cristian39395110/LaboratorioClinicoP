


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

//tieneRole('ADMIN_ROLE','VENTAS_ROLE'),
const tieneRole=(...roles)=>{
   return (req,res,next)=>{

   if(!req.usuario.Rols.some(element => {
      return roles.includes(element.nombre)
   }))  
   return  res.redirect("/")
   
   else  next(); 
       }
   
}


module.exports={
   esAdminRol,tieneRole
}