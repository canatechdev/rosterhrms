const pool = require('../../config/database');

const createCaste = async (name, full_name, priority,full_name_mr) => {
    const result = await pool.query(
        `INSERT INTO castes (name, full_name, full_name_mr, priority)
         VALUES ($1, $2, $3, $4)
         RETURNING caste_id, name, full_name, full_name_mr, full_name_mr AS name_mr, priority, status`,
        [name, full_name,full_name_mr, priority]
    );
    return result.rows[0];
};

const getCastes = async () => {
    const result = await pool.query(
        `SELECT caste_id, name, full_name, full_name_mr, full_name_mr AS name_mr, priority, status
         FROM castes
         ORDER BY priority ASC`
    );
    return result.rows;
};

const getCasteById = async (id) => {
    const result = await pool.query(
        `SELECT caste_id, name, full_name, full_name_mr, full_name_mr AS name_mr, priority, status
         FROM castes
         WHERE caste_id = $1`,
        [id]
    );
    return result.rows[0];
};

const updateCaste = async (id, name, full_name, priority, status,full_name_mr) => {
    const result = await pool.query(
        `UPDATE castes
         SET name = $1, full_name = $2, full_name_mr = $3, priority = $4, status = $5
         WHERE caste_id = $6
         RETURNING caste_id, name, full_name, full_name_mr, full_name_mr AS name_mr, priority, status`,
        [name, full_name,full_name_mr, priority, status, id]
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
