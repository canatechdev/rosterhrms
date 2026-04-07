const roleService = require('../../services/system/role.service.js');
const asyncHandler = require('../../middlewares/async_handler.js');

const createRole = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const role = await roleService.createRole(name, description);
    res.status(201).json({ success: true, data: role });
});

const getRoles = asyncHandler(async (req, res) => {
    const roles = await roleService.getRoles();
    res.status(200).json({ success: true, data: roles });
});

const getRoleById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const role = await roleService.getRoleById(id);
    if (!role) {
        return res.status(404).json({ success: false, message: 'Role not found' });
    }
    res.status(200).json({ success: true, data: role });
});

const updateRole = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const role = await roleService.updateRole(id, name, description);
    if (!role) {
        return res.status(404).json({ success: false, message: 'Role not found' });
    }
    res.status(200).json({ success: true, data: role });
});

const deleteRole = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await roleService.deleteRole(id);
    res.status(200).json({ success: true, message: 'Role deleted successfully' });
});

module.exports = {
    createRole,
    getRoles,
    getRoleById,
    updateRole,
    deleteRole,
};
