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
};
