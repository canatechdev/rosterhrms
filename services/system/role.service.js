const pool = require('../../config/database');

const createRole = async (name, description) => {
    const result = await pool.query(
        'INSERT INTO roles (name, description) VALUES ($1, $2) RETURNING *',
        [name, description]
    );
    return result.rows[0];
};

const getRoles = async () => {
    const result = await pool.query('SELECT * FROM roles ORDER BY role_id ASC');
    return result.rows;
};

const getRoleById = async (id) => {
    const result = await pool.query('SELECT * FROM roles WHERE role_id = $1', [id]);
    return result.rows[0];
};

const getRolePermissions = async ({ id }) => {
    if (!id) throw { status: 400, message: "Role Id required" }

    const result = await pool.query(`SELECT r.role_id, r.name role_name,
        jsonb_agg(jsonb_build_object('permission_id', p.permission_id, 'permission_name', p.name)) permissions
        FROM roles r JOIN role_permissions rp ON r.role_id=rp.role_id
        JOIN permissions p ON rp.permission_id=p.permission_id
        WHERE r.role_id = $1
        GROUP BY r.name, r.role_id
        `, [id]);
    return result.rows;
};

const updateRole = async (id, name, description) => {
    const result = await pool.query(
        'UPDATE roles SET name = $1, description = $2 WHERE role_id = $3 RETURNING *',
        [name, description, id]
    );
    return result.rows[0];
};

const deleteRole = async (id) => {
    await pool.query('DELETE FROM roles WHERE role_id = $1', [id]);
};

module.exports = {
    createRole,
    getRoles,
    getRoleById,
    updateRole,
    deleteRole,
    getRolePermissions
};
