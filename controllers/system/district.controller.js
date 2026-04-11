const districtService = require('../../services/system/district.service.js');
const asyncHandler = require('../../middlewares/async_handler.js');

const createDistrict = asyncHandler(async (req, res) => {
    const { name,name_mr } = req.body;
    if(!name) {
        return res.status(400).json({ success: false, message: 'District name is required' });
    }   
    const district = await districtService.createDistrict(name,name_mr);
    res.status(201).json({ success: true, data: district });
});

const getDistricts = asyncHandler(async (req, res) => {
    const districts = await districtService.getDistricts();
    res.status(200).json({ success: true, data: districts });
});

const getDistrictById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const district = await districtService.getDistrictById(id);
    if (!district) {
        return res.status(404).json({ success: false, message: 'District not found' });
    }
    res.status(200).json({ success: true, data: district });
});

const updateDistrict = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name,name_mr } = req.body;
    const district = await districtService.updateDistrict(id, name, status,name_mr);
    if (!district) {
        return res.status(404).json({ success: false, message: 'District not found' });
    }
    res.status(200).json({ success: true, data: district });
});

const deleteDistrict = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await districtService.deleteDistrict(id);
    res.status(200).json({ success: true, message: 'District deleted successfully' });
});

module.exports = {
    createDistrict,
    getDistricts,
    getDistrictById,
    updateDistrict,
    deleteDistrict,
};
