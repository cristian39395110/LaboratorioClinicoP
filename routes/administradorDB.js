const{Router}=require('express');
const { userPost}=require('../controllers/users');
//const {ordenlogin}=require('../controllers/orden');
const router=Router();


//router.post('/',ordenlogin);
router.post('/',userPost);


module.exports=router;

