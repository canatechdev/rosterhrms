const authMiddleware = require('../../middlewares/auth.middleware');
const masterController=require('../../controllers/system/master.controller')
const router=require('express').Router();

router.get("/:master_name", authMiddleware, masterController.getMasters)

module.exports=router