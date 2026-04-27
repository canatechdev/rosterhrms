const appraisalsService = require('../../services/employee/appraisals.service.js');
const asyncHandler = require('../../middlewares/async_handler.js');

// 1. वैयक्तिक माहिती | PERSONAL INFORMATION
exports.initiateAppraisal = asyncHandler(async (req, res) => {
    req.body.user = req.user;
    const result = await appraisalsService.initiateAppraisal(req.body);
    res.status(201).json({ success: true, data: result });
});

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