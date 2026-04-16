const pool = require("../../config/database");
exports.getCasts = async () => {
    const casts = await pool.query("SELECT caste_id,name,full_name FROM CASTES where status=1");
    return casts.rows;
}

exports.getRoles = async (user) => {
    // const ur=await pool.query(`select `,[user.user_id]);
    // if(ur.rows.length==0){
    //     return [];
    // }
    const roles = await pool.query("SELECT role_id,name, description FROM ROLES");
    return roles.rows;
}


// exports.getDepartments = async (zp_id) => {
//     const departments = await pool.query("SELECT department_id,name FROM DEPARTMENTS where status=1 AND zp_id=$1", [zp_id]);
//     return departments.rows;
// }

exports.getPosts = async ({ department_id }, zp_id) => {
    const departments = await pool.query("SELECT department_id FROM DEPARTMENTS where status=1 AND department_id=$1 AND zp_id=$2", [department_id, zp_id]);
    if (departments.rows.length == 0) throw { status: 404, message: "Department not found" };
    const posts = await pool.query("SELECT post_id,designation FROM POSTS where status=1 AND department_id=$1", [department_id]);
    return posts.rows;
}

// exports.getDepartmentHead = async (zp_id ) => {
//     const heads = await pool.query(`SELECT 
//     u.user_id,
//     u.email,
//     up.first_name,
//     up.last_name,
//     r.name AS role,
//     d.name AS department,
//     jsonb_agg(
//         jsonb_build_object(
//             'permission_id', p.permission_id,
//             'name', p.name
//         )
//     ) AS permissions

// FROM users u 
// JOIN roles r ON u.role_id = r.role_id
// JOIN employee_profiles up ON u.user_id = up.user_id
// JOIN departments d ON up.department_id = d.department_id
// JOIN role_permissions rp ON rp.role_id = r.role_id
// JOIN permissions p ON p.permission_id = rp.permission_id

// WHERE r.name = 'Department Head' AND d.zp_id = $1

// GROUP BY 
//     u.user_id,
//     u.email,
//     up.first_name,
//     up.last_name,
//     r.name,
//     d.name;`);
//     return heads.rows;
// }

// exports.getZPAdmins = async (zp_name) => {
//     const admins = await pool.query(`SELECT u.user_id,u.email,up.first_name,up.last_name,r.name as Role,zp.name as ZP,
//         jsonb_agg(
//         jsonb_build_object(
//             'permission_id', p.permission_id,
//             'name', p.name
//         )
//     ) AS permissions
//         FROM users u
//         JOIN roles r ON u.role_id = r.role_id
//         JOIN employee_profiles up ON u.user_id=up.user_id
//         JOIN zp ON u.zp_id=zp.zp_id
//         JOIN role_permissions rp ON rp.role_id = r.role_id
//         JOIN permissions p ON p.permission_id = rp.permission_id
//         WHERE r.name='zp_admin' AND zp.name=$1
//         GROUP BY u.user_id,u.email,up.first_name,up.last_name,r.name,zp.name`, [zp_name]);
//     return admins.rows;
// }