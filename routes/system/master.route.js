const authMiddleware = require('../../middlewares/auth.middleware');
const masterController=require('../../controllers/system/master.controller');
const { reqBody } = require('../../middlewares/req_body.middleware');
const router=require('express').Router();

router.get("/:master_name", authMiddleware, masterController.getMasters)
router.post("/:master_name", authMiddleware, reqBody, masterController.createMaster)
router.put("/:master_name", authMiddleware, reqBody, masterController.updateMaster)
router.delete("/:master_name", authMiddleware, reqBody, masterController.deleteMaster)

module.exports=router