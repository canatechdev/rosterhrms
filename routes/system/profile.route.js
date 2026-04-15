const router = require("express").Router();
const profileController = require('../../controllers/system/profile.controller.js');
const { reqBody } = require('../../middlewares/req_body.middleware.js');
const authMiddleware = require('../../middlewares/auth.middleware.js');
const upload = require("../../config/multer.config");

// वैयक्तिक माहिती | PERSONAL INFORMATION
router.post("/continue", authMiddleware, reqBody, profileController.getCurrentStep);

router.post("/personal_info/1", authMiddleware, reqBody, profileController.savePersonalInfoStep1);
router.post("/personal_info/2", authMiddleware, reqBody, profileController.savePersonalInfoStep2);
router.post("/personal_info/3", authMiddleware, reqBody, profileController.savePersonalInfoStep3);
router.post("/personal_info/4", authMiddleware, upload.fields([
    { name: "marriage_cert" }, { name: "birth_cert" },
    { name: "aadhar" }, { name: "pan" },
    { name: "caste_validity" }, { name: "gazette_name_change" },
    { name: "photo" }, { name: "signature" }
]), profileController.savePersonalInfoStep4);
router.post("/personal_info/5", authMiddleware, reqBody, profileController.savePersonalInfoStep5);
router.post("/personal_info/6", authMiddleware, reqBody, profileController.savePersonalInfoStep6);
router.post("/personal_info/7", authMiddleware, reqBody, profileController.savePersonalInfoStep7);
router.post("/personal_info/8", authMiddleware, reqBody, profileController.savePersonalInfoStep8);

// शैक्षणिक अर्हता | EDUCATIONAL QUALIFICATIONS
router.post("/education/1", authMiddleware, upload.fields([
    { "name": "passing_cert" }, { "name": "training_cert" }
]), reqBody, profileController.saveEducationStep1);
router.post("/education/2", authMiddleware, upload.fields([
    { name: "computer_exam_cert" }, { name: "marathi_typing_cert" },
    { name: "english_typing_cert" }, { name: "marathi_exam_cert" },
    { name: "hindi_exam_cert" }
]), reqBody, profileController.saveEducationStep2);

router.post("/service_info/1", authMiddleware, upload.fields([
    { name: "appointment_order_cert" }
]), reqBody, profileController.saveServiceInfoStep1);
router.post("/service_info/2", authMiddleware, upload.fields([
    { name: "probation_cert" }, { name: "permanent_benefit_cert" }
]), reqBody, profileController.saveServiceInfoStep2);
router.post("/service_info/3", authMiddleware, upload.fields([
    { name:'asset_liability_cert'}
]), reqBody, profileController.saveServiceInfoStep3);
module.exports = router;