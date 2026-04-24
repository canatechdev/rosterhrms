const router = require("express").Router();
const profileController = require('../../controllers/employee/profile.controller.js');
const { reqBody } = require('../../middlewares/req_body.middleware.js');
const authMiddleware = require('../../middlewares/auth.middleware.js');
const upload = require("../../config/multer.config");

// excel
const { generateTemplate, processUploadedFile } = require('../../controllers/Excel/ExcelOps.js');



router.post("/continue", authMiddleware, reqBody, profileController.getCurrentStep);
router.get('/test', (req, res) => { res.json({ message: "Test successful" }) })

// 1. वैयक्तिक माहिती | PERSONAL INFORMATION
router.post("/profile/personal_info/1", authMiddleware, reqBody, profileController.savePersonalInfoStep1);
router.get("/profile/personal_info/1/:user_id", authMiddleware, profileController.getPersonalInfoStep1);

router.post("/profile/personal_info/2", authMiddleware, reqBody, profileController.savePersonalInfoStep2);
router.get("/profile/personal_info/2/:user_id", authMiddleware, profileController.getPersonalInfoStep2);

router.post("/profile/personal_info/3", authMiddleware, reqBody, profileController.savePersonalInfoStep3);
router.get("/profile/personal_info/3/:user_id", authMiddleware, profileController.getPersonalInfoStep3);

router.post("/profile/personal_info/4", authMiddleware, reqBody, profileController.savePersonalInfoStep4);

router.post("/profile/personal_info/5", authMiddleware, upload.fields([
    { name: "marriage_cert" }, { name: "birth_cert" },
    { name: "aadhar" }, { name: "pan" },
    { name: "caste_validity" }, { name: "gazette_name_change" }
]), profileController.savePersonalInfoStep5);

router.post("/profile/personal_info/6", authMiddleware, upload.fields([
    { name: "photo" }, { name: "signature" }
]), profileController.savePersonalInfoStep6);

router.post("/profile/personal_info/7", authMiddleware, reqBody, profileController.savePersonalInfoStep7);
router.post("/profile/personal_info/8", authMiddleware, reqBody, profileController.savePersonalInfoStep8);
router.post("/profile/personal_info/9", authMiddleware, reqBody, profileController.savePersonalInfoStep9);
router.post("/profile/personal_info/10", authMiddleware, reqBody, profileController.savePersonalInfoStep10);

// 2. शैक्षणिक अर्हता | EDUCATIONAL QUALIFICATIONS
router.post("/profile/education/1", authMiddleware, upload.fields([
    { "name": "passing_cert" }
]), reqBody, profileController.saveEducationStep1);
router.post("/profile/education/2", authMiddleware, upload.fields([
    { "name": "training_cert" }
]), reqBody, profileController.saveEducationStep2);
router.post("/profile/education/3", authMiddleware, reqBody, profileController.saveEducationStep3);
router.post("/profile/education/4", authMiddleware, reqBody, profileController.saveEducationStep4);
router.post("/profile/education/5", authMiddleware, upload.fields([
    { name: "computer_exam_cert" }, { name: "marathi_typing_cert" },
    { name: "english_typing_cert" }, { name: "marathi_exam_cert" },
    { name: "hindi_exam_cert" }
]), reqBody, profileController.saveEducationStep5);

// 3. सेवा माहिती | SERVICE INFORMATION
router.post("/profile/service_info/1", authMiddleware, upload.fields([
    { name: "appointment_order_cert" }
]), reqBody, profileController.saveServiceInfoStep1);
router.post("/profile/service_info/2", authMiddleware, upload.fields([
    { name: "probation_cert" }, { name: "permanent_benefit_cert" }
]), reqBody, profileController.saveServiceInfoStep2);
router.post("/profile/service_info/3", authMiddleware, upload.fields([
    { name: 'asset_liability_cert' }
]), reqBody, profileController.saveServiceInfoStep3);

// 4. वेतन माहिती
router.post("/profile/payment_info/1", authMiddleware, reqBody, profileController.savePaymentInfoStep1);
router.post("/profile/payment_info/2", authMiddleware, reqBody, profileController.savePaymentInfoStep2);
router.post("/profile/payment_info/3", authMiddleware, reqBody, profileController.savePaymentInfoStep3);
router.post("/profile/payment_info/4", authMiddleware, reqBody, profileController.savePaymentInfoStep4);

// 5. बदली बदल माहिती  |   TRANSFER_INFO
router.post("/profile/transfer_info/1", authMiddleware, reqBody, profileController.saveTransferInfostep1);
router.post("/profile/promotion_info/1", authMiddleware, reqBody, profileController.savePromotionInfostep1);

// 6. सेवा विस्तार माहिती  | SERVICE_EXTENSION_INFO
router.post("/profile/service_extension_info/1", authMiddleware, upload.fields([{
    name: 'withheld_order_cert'
}]), reqBody, profileController.saveServiceExtensionInfostep1);

// 7. अपंगत्व माहिती  | DISABILITY_INFO
router.post("/profile/disability_info/1", authMiddleware, upload.fields([{
    name: 'disability_cert'
}]), reqBody, profileController.saveDisabilityInfostep1);

// 8. गटविमा माहिती २७
router.post("/profile/group_insurance/1", authMiddleware, upload.fields([{ name: 'group_insurance_cert' }]), reqBody, profileController.saveGroupInsurance1);

// 9. चौकशी माहिती २८,३०,३१,३२
router.post("/profile/discussion_info/1", authMiddleware, upload.fields([
    { name: 'absence_cert' }
]), reqBody, profileController.saveDiscussionInfo1);

router.post("/profile/discussion_info/2", authMiddleware, upload.fields([
    { name: 'penalty_order_cert' }
]), reqBody, profileController.saveDiscussionInfo2);

router.post("/profile/discussion_info/3", authMiddleware, upload.fields([
    { name: 'order_cert' }
]), reqBody, profileController.saveDiscussionInfo3);

router.post("/profile/discussion_info/4", authMiddleware, upload.fields([
    { name: 'order_cert' }
]), reqBody, profileController.saveDiscussionInfo4);

// 10. अग्रिम माहिती ३५
router.post("/profile/advances_info/1", authMiddleware, reqBody, profileController.saveAdvancesInfo1);

// 11. आजार बदल व इतर माहिती ३४
router.post("/profile/medical_conditions/1", authMiddleware, reqBody, profileController.saveMedicalCondition1);

// 12. सेवापुस्तक माहिती १४,३३
router.post("/profile/service_book/1", authMiddleware, upload.fields([
    { name: 'service_book_cert' }, { name: 'verification_cert' }
]), reqBody, profileController.saveServiceBook1);

// 13. प्रमाणपत्रे माहिती २६
router.post("/profile/certificate_info/1", authMiddleware, upload.fields([
    { name: "character_antecedents" }, { name: "constitution_oath" }, { name: "home_village_decl" }, { name: "medical_cert" }, { name: "small_family_pledge" }, { name: "undertaking" }, { name: "medical_reimbursement_option" }, { name: "nps_family_pension_option" }]), reqBody, profileController.saveCertificateInfo1);




// APPRAISAL
router.get("/appraisal/info/:user_id", authMiddleware, profileController.getAppraisalInfo);



// EXCEL IMPORTS
router.get('/template', generateTemplate);
router.post('/upload', upload.single('file'), processUploadedFile);


module.exports = router;