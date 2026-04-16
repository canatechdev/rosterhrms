const pool = require('../../config/database');

exports.createDepartment = async (name, zp_id) => {
    const result = await pool.query(
        `INSERT INTO departments (name, zp_id) VALUES ($1, $2) 
        ON CONFLICT(zp_id, name) DO UPDATE SET 
        status=1, NAME=EXCLUDED.NAME
        RETURNING *`,
        [name, zp_id]
    );
    return result.rows[0];
};

exports.getDepartments = async () => {
    const result = await pool.query(`
        SELECT d.department_id, d.name FROM departments d
    `);
    return result.rows;
};

exports.getDepartmentById = async (id) => {
    const result = await pool.query('SELECT * FROM departments WHERE department_id = $1 and status=1', [id]);
    return result.rows[0];
};

exports.getDepartmentHead = async ({ user_id }) => {
    const zp = await pool.query(`SELECT zp_id FROM users WHERE user_id=$1`, [user_id]);
    // console.log('user_id in service', user_id)
    console.log('kk', zp.rows, zp.rows[0].zp_id)
    if (zp.rowCount === 0) throw { status: 400, message: "No ZP Associated with this user" }

    const heads = await pool.query(`
    SELECT 
        u.user_id,
        u.email,
        up.first_name,
        up.last_name,
        r.name AS role,
        d.name AS department,
        jsonb_agg(
            jsonb_build_object(
                'permission_id', p.permission_id,
                'name', p.name
            )
        ) AS permissions

    FROM users u 
    JOIN employee_profiles up ON u.user_id = up.user_id
    JOIN roles r ON u.role_id = r.role_id
    JOIN departments d ON up.department_id = d.department_id
    JOIN role_permissions rp ON rp.role_id = r.role_id
    JOIN permissions p ON p.permission_id = rp.permission_id

    WHERE r.name = 'dept_head' AND d.zp_id = $1

    GROUP BY 
        u.user_id,
        u.email,
        up.first_name,
        up.last_name,
        r.name,
        d.name;`, [zp.rows[0].zp_id]);
    return heads.rows;
}
exports.updateDepartment = async (id, name, zp_id, status) => {
    const result = await pool.query(
        'UPDATE departments SET name = $1, zp_id = $2, status = $3 WHERE department_id = $4 RETURNING *',
        [name, zp_id, status, id]
    );
    return result.rows[0];
};

exports.deleteDepartment = async (id) => {
    await pool.query('UPDATE departments SET status = 0 WHERE department_id = $1', [id]);
};

// module.exports = {
//     createDepartment,
//     getDepartments,
//     getDepartmentById,
//     updateDepartment,
//     deleteDepartment,
// };
