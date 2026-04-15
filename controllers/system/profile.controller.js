const profileService = require('../../services/system/profile.service.js');

exports.savePersonalInfoStep1 = async (req, res) => {
    try {
        // req.body.user_id = req.user.user_id;
        // res.send(req.body)
        const result = await profileService.savePersonalInfoStep1(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.savePersonalInfoStep2 = async (req, res) => {
    try {
        // req.body.user_id = req.user.user_id;
        const result = await profileService.savePersonalInfoStep2(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.savePersonalInfoStep3 = async (req, res) => {
    try {
        const result = await profileService.savePersonalInfoStep3(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.savePersonalInfoStep4 = async (req, res) => {
    try {
        req.body.marriage_cert = req.files['marriage_cert'] ? req.files['marriage_cert'][0].filename : null;
        req.body.birth_cert = req.files['birth_cert'] ? req.files['birth_cert'][0].filename : null;
        req.body.aadhar = req.files['aadhar'] ? req.files['aadhar'][0].filename : null;
        req.body.pan = req.files['pan'] ? req.files['pan'][0].filename : null;
        req.body.caste_validity = req.files['caste_validity'] ? req.files['caste_validity'][0].filename : null;
        req.body.gazette_name_change = req.files['gazette_name_change'] ? req.files['gazette_name_change'][0].filename : null;
        req.body.photo = req.files['photo'] ? req.files['photo'][0].filename : null;
        req.body.signature = req.files['signature'] ? req.files['signature'][0].filename : null;
        
        const result = await profileService.savePersonalInfoStep4(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.savePersonalInfoStep5 = async (req, res) => {
    try {
        const result = await profileService.savePersonalInfoStep5(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.savePersonalInfoStep6 = async (req, res) => {
    try {
        const result = await profileService.savePersonalInfoStep6(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.savePersonalInfoStep7 = async (req, res) => {
    try {
        const result = await profileService.savePersonalInfoStep7(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.savePersonalInfoStep8 = async (req, res) => {
    try {
        const result = await profileService.savePersonalInfoStep8(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// CONTROLLER FUNCTIONS FOR EDUCATION STEPS
exports.saveEducationStep1 = async (req, res) => {
    try {
        
        req.body.passing_cert = req.files ? req.files["passing_cert"][0].filename : null;
        req.body.training_cert = req.files ? req.files["training_cert"][0].filename : null;

        const result = await profileService.saveEducationStep1(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.saveEducationStep2 = async (req, res) => {
    try {
        req.body.computer_exam_cert=req.files ? req.files["computer_exam_cert"] ? req.files["computer_exam_cert"][0].filename : null : null;
        req.body.marathi_typing_cert=req.files ? req.files["marathi_typing_cert"] ? req.files["marathi_typing_cert"][0].filename : null : null;
        req.body.english_typing_cert=req.files ? req.files["english_typing_cert"] ? req.files["english_typing_cert"][0].filename : null : null;
        req.body.marathi_exam_cert=req.files ? req.files["marathi_exam_cert"] ? req.files["marathi_exam_cert"][0].filename : null : null;
        req.body.hindi_exam_cert=req.files ? req.files["hindi_exam_cert"] ? req.files["hindi_exam_cert"][0].filename : null : null;
        const result = await profileService.saveEducationStep2(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.saveServiceInfoStep1 = async (req, res) => {
    try {
        req.body.appointment_order_cert=req.files ? req.files["appointment_order_cert"] ? req.files["appointment_order_cert"][0].filename : null : null;
        const result = await profileService.saveServiceInfoStep1(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.saveServiceInfoStep2 = async (req, res) => {
    try {
        req.body.probation_cert = req.files ? req.files["probation_cert"] ? req.files["probation_cert"][0].filename : null : null;
        req.body.permanent_benefit_cert = req.files ? req.files["permanent_benefit_cert"] ? req.files["permanent_benefit_cert"][0].filename : null : null;
        
        const result = await profileService.saveServiceInfoStep2(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.saveServiceInfoStep3 = async (req, res) => {
    try {
        req.body.asset_liability_cert = req.files ? req.files["asset_liability_cert"] ? req.files["asset_liability_cert"][0].filename : null : null;
        const result = await profileService.saveServiceInfoStep3(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCurrentStep = async (req, res) => {
    try {
        // req.body.user_id = req.user.user_id;
        // res.send(req.body)
        const result = await profileService.getCurrentStep(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};