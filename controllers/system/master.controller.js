const masterService = require('../../services/system/master.service.js');
const asyncHandler = require('../../middlewares/async_handler.js');

exports.getMasters = asyncHandler(async (req, res) => {
    const result = await masterService.getMasters(req.params);
    res.status(201).json({ success: true, data: result });
})
exports.createMaster = asyncHandler(async (req, res) => {
    if(!req.params.master_name) throw { status: 400, message: "Master Name is required" };
    
    const result = await masterService.createMaster(req.params, req.body);
    res.status(201).json({ success: true, data: result });
})

exports.updateMaster = asyncHandler(async (req, res) => {
    const result = await masterService.updateMaster(req.params, req.body);
    res.status(201).json({ success: true, data: result });
})

exports.deleteMaster = asyncHandler(async (req, res) => {
    const result = await masterService.deleteMaster(req.params, req.body);
    res.status(201).json({ success: true, data: result });
})