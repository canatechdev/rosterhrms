const appraisalsService = require('../../services/employee/appraisals.service.js');
const asyncHandler = require('../../middlewares/async_handler.js');

// 1. वैयक्तिक माहिती | PERSONAL INFORMATION
exports.initiateAppraisal = asyncHandler(async (req, res) => {
    req.body.user = req.user;
    const result = await appraisalsService.initiateAppraisal(req.body);
    res.status(201).json({ success: true, data: result });
});

exports.getAppraisalStatus = asyncHandler(async (req, res) => {
    const result = await appraisalsService.getAppraisalStatus(req.user);
    res.status(200).json({ success: true, data: result });
})

exports.initiateAppraisalEmployee = asyncHandler(async (req, res) => {
    req.body.user = req.user;
    const result = await appraisalsService.initiateAppraisalEmployee(req.body);
    res.status(201).json({ success: true, data: result });
});

exports.section1AppraisalEmployee = asyncHandler(async (req, res) => {
    req.body.user = req.user;
    const result = await appraisalsService.section1AppraisalEmployee(req.body);
    res.status(201).json({ success: true, data: result });
});

exports.getSection1AppraisalEmployee = asyncHandler(async (req, res) => {

    const result = await appraisalsService.getSection1AppraisalEmployee(req.user);
    res.status(201).json({ success: true, data: result });
});

exports.section2AppraisalEmployee = asyncHandler(async (req, res) => {
    req.body.user = req.user;
    const result = await appraisalsService.section2AppraisalEmployee(req.body);
    res.status(201).json({ success: true, data: result });
});

exports.section3AppraisalEmployee = asyncHandler(async (req, res) => {
    req.body.user = req.user;
    const result = await appraisalsService.section3AppraisalEmployee(req.body);
    res.status(201).json({ success: true, data: result });
});

exports.section4AppraisalEmployee = asyncHandler(async (req, res) => {
    req.body.user = req.user;
    const result = await appraisalsService.section4AppraisalEmployee(req.body);
    res.status(201).json({ success: true, data: result });
});

exports.getPendingAppraisals = async (req, res, next) => {
    try {
        const appraisals = await appraisalsService.getPendingAppraisals(req.user);
        res.status(200).json(appraisals);
    } catch (error) {
        next(error);
    }
}