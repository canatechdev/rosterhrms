const masterService = require('../../services/system/master.service.js');
const asyncHandler = require('../../middlewares/async_handler.js');

exports.getMasters = asyncHandler(async (req, res) => {
    const result = await masterService.getMasters(req.params);
    res.status(201).json({ success: true, data: result });
})