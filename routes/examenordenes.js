const express = require('express')
const { examenOrdenPost,examenOrdenGet,prueba} = require('../controllers/examenordenes')

const router=express.Router();

router.post('/',examenOrdenPost);
router.get('/',examenOrdenGet);
router.post('/prueba',prueba);

module.exports=router