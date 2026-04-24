const systemService = require("../../services/system/system.service");

exports.getEmployees = async (req, res) => {
    const employees = await systemService.getEmployees();
    res.json(employees);
}

exports.getEmployeeById = async (req, res) => {
    const employees = await systemService.getEmployeeById(req.params);
    res.json(employees);
}

exports.deleteEmployeeById = async (req, res) => {
    const employees = await systemService.deleteEmployeeById(req.params);
    res.json(employees);
}

// get all casts
exports.getCasts = async (req, res) => {
    const casts = await systemService.getCasts();
    res.json(casts);
}

// get all roles
exports.getRoles = async (req, res) => {
    const roles = await systemService.getRoles(req.user);
    res.json(roles);
}

// get all departments
exports.getDepartments = async (req, res) => {
    const zp_id = req.user.user_id;
    const departments = await systemService.getDepartments(zp_id);
    res.json(departments);
}

// get all posts
exports.getPosts = async (req, res) => {
    if (!req.params) throw { status: 400, message: "Department id is required" };
    const zp_id = req.user.user_id;
    const posts = await systemService.getPosts(req.params, zp_id);
    res.json(posts);
}

// // get all getDepartmentHead
// exports.getDepartmentHead=async(req,res)=>{
//     // if(!req.params) throw {status:400,message:"Department id is required"};
//     const zp_id=req.user.user_id;
//     const posts = await systemService.getDepartmentHead(zp_id);
//     res.json(posts);
// }

// get all getZPAdmins
exports.getZPAdmins = async (req, res) => {
    const zp_name = req.params.zp_name;
    const zpAdmins = await systemService.getZPAdmins(zp_name);
    res.json(zpAdmins);
}

