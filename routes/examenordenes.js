const express = require('express')
const { examenOrdenPost,examenOrdenGet} = require('../controllers/examenordenes')

const router=express.Router();

router.post('/',examenOrdenPost);
router.get('/',examenOrdenGet);

module.exports=router