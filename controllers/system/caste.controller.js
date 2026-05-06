const casteService = require('../../services/system/caste.service.js');
const asyncHandler = require('../../middlewares/async_handler.js');

const createCaste = asyncHandler(async (req, res) => {
    // const { name, full_name,full_name_mr, priority } = ;
    const caste = await casteService.createCaste(req.body);
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
    req.body.id= id;
    const caste = await casteService.updateCaste(req.body);
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
