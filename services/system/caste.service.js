const pool = require('../../config/database');

const createCaste = async (name, full_name, priority,name_mr,full_name_mr) => {
    const result = await pool.query(
        'INSERT INTO castes (name, full_name,name_mr,full_name_mr, priority) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, full_name,name_mr,full_name_mr, priority]
    );
    return result.rows[0];
};

const getCastes = async () => {
    const result = await pool.query('SELECT * FROM castes ORDER BY priority ASC');
    return result.rows;
};

const getCasteById = async (id) => {
    const result = await pool.query('SELECT * FROM castes WHERE caste_id = $1', [id]);
    return result.rows[0];
};

const updateCaste = async (id, name, full_name, priority, status,name_mr,full_name_mr) => {
    const result = await pool.query(
        'UPDATE castes SET name = $1, full_name = $2, name_mr = $3, full_name_mr = $4, priority = $5, status = $6 WHERE caste_id = $7 RETURNING *',
        [name, full_name,name_mr,full_name_mr, priority, status, id]
    );
    return result.rows[0];
};

const deleteCaste = async (id) => {
    await pool.query('DELETE FROM castes WHERE caste_id = $1', [id]);
};

module.exports = {
    createCaste,
    getCastes,
    getCasteById,
    updateCaste,
    deleteCaste,
};
