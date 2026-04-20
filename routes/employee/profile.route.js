const router = require("express").Router();
const profileController = require('../../controllers/employee/profile.controller.js');
const { reqBody } = require('../../middlewares/req_body.middleware.js');
const authMiddleware = require('../../middlewares/auth.middleware.js');
const upload = require("../../config/multer.config");

router.post("/continue", authMiddleware, reqBody, profileController.getCurrentStep);
router.get('/test',(req,res)=>{res.json({message:"Test successful"})})

// 1. वैयक्तिक माहिती | PERSONAL INFORMATION
router.post("/profile/personal_info/1", authMiddleware, reqBody, profileController.savePersonalInfoStep1);
router.post("/profile/personal_info/2", authMiddleware, reqBody, profileController.savePersonalInfoStep2);
router.post("/profile/personal_info/3", authMiddleware, reqBody, profileController.savePersonalInfoStep3);
router.post("/profile/personal_info/4", authMiddleware, upload.fields([
    { name: "marriage_cert" }, { name: "birth_cert" },
    { name: "aadhar" }, { name: "pan" },
    { name: "caste_validity" }, { name: "gazette_name_change" },
    { name: "photo" }, { name: "signature" }
]), profileController.savePersonalInfoStep4);
router.post("/profile/personal_info/5", authMiddleware, reqBody, profileController.savePersonalInfoStep5);
router.post("/profile/personal_info/6", authMiddleware, reqBody, profileController.savePersonalInfoStep6);
router.post("/profile/personal_info/7", authMiddleware, reqBody, profileController.savePersonalInfoStep7);
router.post("/profile/personal_info/8", authMiddleware, reqBody, profileController.savePersonalInfoStep8);

// 2. शैक्षणिक अर्हता | EDUCATIONAL QUALIFICATIONS
router.post("/profile/education/1", authMiddleware, upload.fields([
    { "name": "passing_cert" }, { "name": "training_cert" }
]), reqBody, profileController.saveEducationStep1);
router.post("/profile/education/2", authMiddleware, upload.fields([
    { name: "computer_exam_cert" }, { name: "marathi_typing_cert" },
    { name: "english_typing_cert" }, { name: "marathi_exam_cert" },
    { name: "hindi_exam_cert" }
]), reqBody, profileController.saveEducationStep2);

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

// 4. बदली बदल माहिती  |   TRANSFER_INFO
router.post("/profile/transfer_info/1", authMiddleware, reqBody, profileController.saveTransferInfostep1);
router.post("/profile/promotion_info/1", authMiddleware, reqBody, profileController.savePromotionInfostep1);

// 5. सेवा विस्तार माहिती  | SERVICE_EXTENSION_INFO
router.post("/profile/service_extension_info/1", authMiddleware, upload.fields([{
    name: 'withheld_order_cert'
}]), reqBody, profileController.saveServiceExtensionInfostep1);

// 6. अपंगत्व माहिती  | DISABILITY_INFO
router.post("/profile/disability_info/1", authMiddleware, upload.fields([{
    name: 'disability_cert'
}]), reqBody, profileController.saveDisabilityInfostep1);

// 7. गटविमा माहिती २७
router.post("/profile/group_insurance/1", authMiddleware, upload.fields([{ name: 'group_insurance_cert' }]), reqBody, profileController.saveGroupInsurance1);

// 8. चौकशी माहिती २८,३०,३१,३२
router.post("/profile/discussion_info/1", authMiddleware, upload.fields([
    { name: 'absence_cert' }, { name: 'penalty_order_cert' }
]), reqBody, profileController.saveDiscussionInfo1);

router.post("/profile/discussion_info/2", authMiddleware, upload.fields([
    { name: 'order_cert' }
]), reqBody, profileController.saveDiscussionInfo2);

router.post("/profile/discussion_info/3", authMiddleware, upload.fields([
    { name: 'order_cert' }
]), reqBody, profileController.saveDiscussionInfo3);

// 9. अग्रिम माहिती ३५
router.post("/profile/advances_info/1", authMiddleware, reqBody, profileController.saveAdvancesInfo1);

// 10. आजार बदल व इतर माहिती ३४
router.post("/profile/medical_conditions/1", authMiddleware, reqBody, profileController.saveMedicalCondition1);

// 11. सेवापुस्तक माहिती १४,३३
router.post("/profile/service_book/1", authMiddleware, upload.fields([
    { name: 'service_book_cert' }, { name: 'verification_cert' }
]), reqBody, profileController.saveServiceBook1);

// 12. प्रमाणपत्रे माहिती २६
router.post("/profile/certificate_info/1", authMiddleware, upload.fields([
    { name: "character_antecedents" }, { name: "constitution_oath" }, { name: "home_village_decl" }, { name: "medical_cert" }, { name: "small_family_pledge" }, { name: "undertaking" }, { name: "medical_reimbursement_option" }, { name: "nps_family_pension_option" }]), reqBody, profileController.saveCertificateInfo1);

module.exports = router;