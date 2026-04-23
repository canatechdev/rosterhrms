const departmentService = require('../../services/system/department.service.js');
const asyncHandler = require('../../middlewares/async_handler.js');

const createDepartment = asyncHandler(async (req, res) => {
    // const { name, zp_id, code,  } = req.body;
    const department = await departmentService.createDepartment(req.body);
    res.status(201).json({ success: true, data: department });
});

const getDepartments = asyncHandler(async (req, res) => {
    const departments = await departmentService.getDepartments();
    res.status(200).json({ success: true, data: departments });
});


const getDepartmentById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const department = await departmentService.getDepartmentById(id);
    if (!department) {
        return res.status(404).json({ success: false, message: 'Department not found' });
    }
    res.status(200).json({ success: true, data: department });
});

// get all getDepartmentHead
const getDepartmentHead = async (req, res) => {
    // if(!req.params) throw {status:400,message:"Department id is required"};
    // const zp_id = .user_id;
    // console.log('radha',req.user)
    const posts = await departmentService.getDepartmentHead(req.user);
    res.json(posts);
}

const updateDepartment = asyncHandler(async (req, res) => {
    // const { id } = req.params;
    // const { name, zp_id, code, status } = req.body;
    req.body.id = req.params.id;
    const department = await departmentService.updateDepartment(req.body);
    if (!department) {
        return res.status(404).json({ success: false, message: 'Department not found' });
    }
    res.status(200).json({ success: true, data: department });
});

const deleteDepartment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await departmentService.deleteDepartment(id);
    res.status(200).json({ success: true, message: 'Department deleted successfully' });
});

module.exports = {
    createDepartment,
    getDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
    getDepartmentHead
};
