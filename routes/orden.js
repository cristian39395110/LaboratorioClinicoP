const{Router}=require('express');
const {ordenPost,ordenesGet}=require('../controllers/orden');

const router=Router();

router.post('/',ordenPost);
router.get('/',ordenesGet);

module.exports=router;

