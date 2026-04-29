const router = require("express").Router();
const appraisalController = require('../../controllers/employee/appraisals.controller.js');
const { reqBody } = require('../../middlewares/req_body.middleware.js');
const authMiddleware = require('../../middlewares/auth.middleware.js');
const upload = require("../../config/multer.config");

// excel
// const { generateTemplate, processUploadedFile } = require('../../controllers/Excel/ExcelOps.js');



router.post("/initiate", authMiddleware, reqBody, appraisalController.initiateAppraisal);
router.post("/employee", authMiddleware, reqBody, appraisalController.initiateAppraisalEmployee);
router.post("/section1", authMiddleware, reqBody, appraisalController.section1AppraisalEmployee);
router.get("/section1", authMiddleware, appraisalController.getSection1AppraisalEmployee);
router.post("/section2", authMiddleware, reqBody, appraisalController.section2AppraisalEmployee);
router.post("/section3", authMiddleware, reqBody, appraisalController.section3AppraisalEmployee);
router.post("/section4", authMiddleware, reqBody, appraisalController.section4AppraisalEmployee);
// router.get("/section1", authMiddleware, appraisalController.getSection1AppraisalEmployee);
// router.get('/test', (req, res) => { res.json({ message: "Test successful" }) })

module.exports = router;