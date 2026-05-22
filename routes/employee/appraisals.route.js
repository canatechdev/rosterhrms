const router = require("express").Router();
const appraisalController = require('../../controllers/employee/appraisals.controller.js');
const { reqBody } = require('../../middlewares/req_body.middleware.js');
const authMiddleware = require('../../middlewares/auth.middleware.js');
const upload = require("../../config/multer.config");

// excel
// const { generateTemplate, processUploadedFile } = require('../../controllers/Excel/ExcelOps.js');
const {
    initiateAppraisal,
    getAppraisalStatus,
    initiateAppraisalEmployee,
    getSection1AppraisalEmployee,
    section1AppraisalEmployee,
    section2AppraisalEmployee,
    section3AppraisalEmployee,
    section4AppraisalEmployee,
    getPendingAppraisals
} = require('../../controllers/employee/appraisals.controller');
const { auth } = require('../../middlewares/auth.middleware');

// const { generateTemplate, processUploadedFile } = require('../../controllers/Excel/ExcelOps.js');

router.post("/initiate", authMiddleware, reqBody, appraisalController.initiateAppraisal);
router.get("/status", authMiddleware, appraisalController.getAppraisalStatus)
router.post("/employee", authMiddleware, reqBody, appraisalController.initiateAppraisalEmployee);
router.post("/section1", authMiddleware, reqBody, appraisalController.section1AppraisalEmployee);
router.get("/section1", authMiddleware, appraisalController.getSection1AppraisalEmployee);
router.post("/section2", authMiddleware, reqBody, appraisalController.section2AppraisalEmployee);
router.post("/section3", authMiddleware, reqBody, appraisalController.section3AppraisalEmployee);
router.post("/section4", authMiddleware, reqBody, appraisalController.section4AppraisalEmployee);
router.get("/pending", authMiddleware, appraisalController.getPendingAppraisals);

module.exports = router;