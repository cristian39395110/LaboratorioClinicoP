const express = require('express')
const { valorReferenciaPost} = require('../controllers/valorreferencia')

const router=express.Router();

router.post('/',valorReferenciaPost);

module.exports=router