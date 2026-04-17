const permissionService = require('../../services/system/permission.service.js');
const asyncHandler = require('../../middlewares/async_handler.js');

exports.createPermission = asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ success: false, message: 'Permission Name is required' });
    }
    const role = await permissionService.createPermission(name);
    res.status(201).json({ success: true, data: role });
});

// exports.getPermissions = asyncHandler(async (req, res) => {
//     
// });
exports.getPermissions = asyncHandler(async (req, res) => {
    const roles = await permissionService.getPermissions();
    res.status(200).json({ success: true, data: roles });
});

exports.getPermissionById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const role = await permissionService.getById(id);
    if (!role) {
        return res.status(404).json({ success: false, message: 'Role not found' });
    }
    res.status(200).json({ success: true, data: role });
});

exports.getPermissionByRole = asyncHandler(async (req, res) => {
    const { role_id } = req.params;
    const permissions = await permissionService.getPermissionsByRoleId(role_id);
    if (!permissions) {
        return res.status(404).json({ success: false, message: 'Role not found' });
    }
    res.status(200).json({ success: true, data: role });
});

exports.updatePermission = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const role = await permissionService.updatePermission(id, name);
    if (!role) {
        return res.status(404).json({ success: false, message: 'Permission not found' });
    }
    res.status(200).json({ success: true, data: role });
});

exports.deletePermission = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await permissionService.deletePermission(id);
    res.status(200).json({ success: true, message: 'Permission deleted successfully' });
});