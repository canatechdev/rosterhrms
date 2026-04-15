const casteService = require('../../services/system/caste.service.js');
const asyncHandler = require('../../middlewares/async_handler.js');

const createCaste = asyncHandler(async (req, res) => {
    const { name, full_name, priority,name_mr,full_name_mr } = req.body;
    const caste = await casteService.createCaste(name, full_name, priority,name_mr,full_name_mr);
    res.status(201).json({ success: true, data: caste });
});

const getCastes = asyncHandler(async (req, res) => {
    const castes = await casteService.getCastes();
    res.status(200).json({ success: true, data: castes });
});

const getCasteById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const caste = await casteService.getCasteById(id);
    if (!caste) {
        return res.status(404).json({ success: false, message: 'Caste not found' });
    }
    res.status(200).json({ success: true, data: caste });
});

const updateCaste = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, full_name, priority, status,name_mr,full_name_mr } = req.body;
    const caste = await casteService.updateCaste(id, name, full_name, priority, status,name_mr,full_name_mr);
    if (!caste) {
        return res.status(404).json({ success: false, message: 'Caste not found' });
    }
    res.status(200).json({ success: true, data: caste });
});

const deleteCaste = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await casteService.deleteCaste(id);
    res.status(200).json({ success: true, message: 'Caste deleted successfully' });
});

module.exports = {
    createCaste,
    getCastes,
    getCasteById,
    updateCaste,
    deleteCaste,
};
