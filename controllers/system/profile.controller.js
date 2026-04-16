const profileService = require('../../services/system/profile.service.js');
const asyncHandler = require('../../middlewares/async_handler.js');

exports.savePersonalInfoStep1 = asyncHandler(async (req, res) => {
    const result = await profileService.savePersonalInfoStep1(req.body);
    res.status(201).json({ success: true, data: result });
});
exports.savePersonalInfoStep2 = asyncHandler(async (req, res) => {
    // req.body.user_id = req.user.user_id;
    const result = await profileService.savePersonalInfoStep2(req.body);
    res.status(201).json({ success: true, data: result });

});
exports.savePersonalInfoStep3 = asyncHandler(async (req, res) => {
    const result = await profileService.savePersonalInfoStep3(req.body);
    res.status(201).json({ success: true, data: result });
});

exports.savePersonalInfoStep4 = asyncHandler(async (req, res) => {
    req.body.marriage_cert = req.files['marriage_cert'] ? req.files['marriage_cert'][0].filename : null;
    req.body.birth_cert = req.files['birth_cert'] ? req.files['birth_cert'][0].filename : null;
    req.body.aadhar = req.files['aadhar'] ? req.files['aadhar'][0].filename : null;
    req.body.pan = req.files['pan'] ? req.files['pan'][0].filename : null;
    req.body.caste_validity = req.files['caste_validity'] ? req.files['caste_validity'][0].filename : null;
    req.body.gazette_name_change = req.files['gazette_name_change'] ? req.files['gazette_name_change'][0].filename : null;
    req.body.photo = req.files['photo'] ? req.files['photo'][0].filename : null;
    req.body.signature = req.files['signature'] ? req.files['signature'][0].filename : null;

    const result = await profileService.savePersonalInfoStep4(req.body);
    res.status(201).json({ success: true, data: result });
});
exports.savePersonalInfoStep5 = asyncHandler(async (req, res) => {
    const result = await profileService.savePersonalInfoStep5(req.body);
    res.status(201).json({ success: true, data: result });
});
exports.savePersonalInfoStep6 = asyncHandler(async (req, res) => {

    const result = await profileService.savePersonalInfoStep6(req.body);
    res.status(201).json({ success: true, data: result });

});
exports.savePersonalInfoStep7 = asyncHandler(async (req, res) => {

    const result = await profileService.savePersonalInfoStep7(req.body);
    res.status(201).json({ success: true, data: result });

});
exports.savePersonalInfoStep8 = asyncHandler(async (req, res) => {

    const result = await profileService.savePersonalInfoStep8(req.body);
    res.status(201).json({ success: true, data: result });

});

// CONTROLLER FUNCTIONS FOR EDUCATION STEPS
exports.saveEducationStep1 = asyncHandler(async (req, res) => {

    req.body.training_cert = req.files ? req.files["training_cert"] ? req.files["training_cert"][0].filename : null : null;
    req.body.passing_cert = req.files ? req.files["passing_cert"] ? req.files["passing_cert"][0].filename : null : null;

    const result = await profileService.saveEducationStep1(req.body);
    res.status(201).json({ success: true, data: result });

});
exports.saveEducationStep2 = asyncHandler(async (req, res) => {

    req.body.computer_exam_cert = req.files ? req.files["computer_exam_cert"] ? req.files["computer_exam_cert"][0].filename : null : null;
    req.body.marathi_typing_cert = req.files ? req.files["marathi_typing_cert"] ? req.files["marathi_typing_cert"][0].filename : null : null;
    req.body.english_typing_cert = req.files ? req.files["english_typing_cert"] ? req.files["english_typing_cert"][0].filename : null : null;
    req.body.marathi_exam_cert = req.files ? req.files["marathi_exam_cert"] ? req.files["marathi_exam_cert"][0].filename : null : null;
    req.body.hindi_exam_cert = req.files ? req.files["hindi_exam_cert"] ? req.files["hindi_exam_cert"][0].filename : null : null;
    const result = await profileService.saveEducationStep2(req.body);
    res.status(201).json({ success: true, data: result });

});
exports.saveServiceInfoStep1 = asyncHandler(async (req, res) => {
    req.body.appointment_order_cert = req.files ? req.files["appointment_order_cert"] ? req.files["appointment_order_cert"][0].filename : null : null;
    const result = await profileService.saveServiceInfoStep1(req.body);
    res.status(201).json({ success: true, data: result });

});

exports.saveServiceInfoStep2 = asyncHandler(async (req, res) => {

    req.body.probation_cert = req.files ? req.files["probation_cert"] ? req.files["probation_cert"][0].filename : null : null;
    req.body.permanent_benefit_cert = req.files ? req.files["permanent_benefit_cert"] ? req.files["permanent_benefit_cert"][0].filename : null : null;

    const result = await profileService.saveServiceInfoStep2(req.body);
    res.status(201).json({ success: true, data: result });

});

exports.saveServiceInfoStep3 = asyncHandler(async (req, res) => {

    req.body.asset_liability_cert = req.files ? req.files["asset_liability_cert"] ? req.files["asset_liability_cert"][0].filename : null : null;
    const result = await profileService.saveServiceInfoStep3(req.body);
    res.status(201).json({ success: true, data: result });

});

exports.saveTransferInfostep1 = asyncHandler(async (req, res) => {
    const result = await profileService.saveTransferInfostep1(req.body);
    res.status(201).json({ success: true, data: result });
});
exports.savePromotionInfostep1 = asyncHandler(async (req, res) => {
    const result = await profileService.savePromotionInfostep1(req.body);
    res.status(201).json({ success: true, data: result });
});

exports.saveServiceExtensionInfostep1 = asyncHandler(async (req, res) => {
    req.body.withheld_order_cert = req.files ? req.files["withheld_order_cert"] ? req.files["withheld_order_cert"][0].filename : null : null;

    const result = await profileService.saveServiceExtensionInfostep1(req.body);
    res.status(201).json({ success: true, data: result });
});

exports.saveDisabilityInfostep1 = asyncHandler(async (req, res) => {
    req.body.disability_cert = req.files ? req.files["disability_cert"] ? req.files["disability_cert"][0].filename : null : null;

    const result = await profileService.saveDisabilityInfostep1(req.body);
    res.status(201).json({ success: true, data: result });
});

exports.getCurrentStep = asyncHandler(async (req, res) => {
    const result = await profileService.getCurrentStep(req.body);
    res.status(200).json({ success: true, data: result });
    // if (result.length == 0) throw { status: 404, message: "Profile not found for the user" };

});