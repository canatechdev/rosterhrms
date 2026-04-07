const pool = require('../../config/database');

const createDepartment = async (name, zp_id) => {
    const result = await pool.query(
        'INSERT INTO departments (name, zp_id) VALUES ($1, $2) RETURNING *',
        [name, zp_id]
    );
    return result.rows[0];
};

const getDepartments = async () => {
    const result = await pool.query(`
        SELECT d.*, z.name as zp_name
        FROM departments d
        LEFT JOIN zp z ON d.zp_id = z.zp_id
        WHERE d.status = 1
        ORDER BY d.department_id ASC
    `);
    return result.rows;
};

const getDepartmentById = async (id) => {
    const result = await pool.query('SELECT * FROM departments WHERE department_id = $1 and status=1', [id]);
    return result.rows[0];
};

const updateDepartment = async (id, name, zp_id, status) => {
    const result = await pool.query(
        'UPDATE departments SET name = $1, zp_id = $2, status = $3 WHERE department_id = $4 RETURNING *',
        [name, zp_id, status, id]
    );
    return result.rows[0];
};

const deleteDepartment = async (id) => {
    await pool.query('UPDATE departments SET status = 0 WHERE department_id = $1', [id]);
};

module.exports = {
    createDepartment,
    getDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
};
