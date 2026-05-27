const binduService = require('../../services/system/bindu.service.js');
const asyncHandler = require('../../middlewares/async_handler.js');

const createBinduPoint = asyncHandler(async (req, res) => {
    const binduPoint = await binduService.createBinduPoint(req.body);
    res.status(201).json({ success: true, data: binduPoint });
});

const getBinduPoints = asyncHandler(async (req, res) => {
    const binduPoints = await binduService.getBinduPoints();
    res.status(200).json({ success: true, data: binduPoints });
});

const getBinduPointById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const binduPoint = await binduService.getBinduPointById(id);
    if (!binduPoint) {
        return res.status(404).json({ success: false, message: 'Bindu point not found' });
    }
    res.status(200).json({ success: true, data: binduPoint });
});

const updateBinduPoint = asyncHandler(async (req, res) => {
    req.body.id = req.params.id;
    const binduPoint = await binduService.updateBinduPoint(req.body);
    if (!binduPoint) {
        return res.status(404).json({ success: false, message: 'Bindu point not found' });
    }
    res.status(200).json({ success: true, data: binduPoint });
});

const deleteBinduPoint = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const binduPoint = await binduService.deleteBinduPoint(id);
    if (!binduPoint) {
        return res.status(404).json({ success: false, message: 'Bindu point not found' });
    }
    res.status(200).json({ success: true, message: 'Bindu point deleted successfully' });
});

module.exports = {
    createBinduPoint,
    getBinduPoints,
    getBinduPointById,
    updateBinduPoint,
    deleteBinduPoint,
};
