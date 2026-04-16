const pool = require('../../config/database');

const createPermission = async (name, role_id) => {
    const isRole = await pool.query(`select 1 from roles where role_id=$1`, [role_id]);
    
    if (isRole.rowCount == 0) throw { status: 400, message: "Invalid Role ID" };
    const result = await pool.query(
        'INSERT INTO permissions (name) VALUES ($1) RETURNING *',
        [name]
    );
    await pool.query('INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)', [role_id, result.rows[0].permission_id]);
    return result.rows[0];
};

const getPermissions = async () => {
    const result = await pool.query('SELECT * FROM permissions');
    return result.rows;
};

const getById = async (id) => {
    const result = await pool.query('SELECT * FROM permissions WHERE permission_id = $1', [id]);
    return result.rows[0];
};

const updatePermission = async (id, name) => {
    const result = await pool.query(
        'UPDATE permissions SET name = $1 WHERE permission_id = $2 RETURNING *',
        [name,id]
    );
    return result.rows[0];
};

const deletePermission = async (id) => {
    await pool.query('DELETE FROM roles WHERE role_id = $1', [id]);
};

module.exports = {
    createPermission,
    getPermissions,
    getById,
    updatePermission,
    deletePermission
};
