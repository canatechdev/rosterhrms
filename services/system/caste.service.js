const pool = require('../../config/database');

const createCaste = async ({ name, name_mr, priority, code }) => {
    if (!name || !name_mr || !priority || !code) throw { status: 400, message: "All fields are required" };
    const result = await pool.query(
        `INSERT INTO castes (name, name_mr,code, priority)
         VALUES ($1, $2, $3, $4)
         RETURNING caste_id, name, name_mr, code, priority, status`,
        [name, name_mr, code, priority]
    );
    return result.rows[0];
};

const getCastes = async () => {
    const result = await pool.query(
        `SELECT caste_id, name, name_mr, code, priority, status
         FROM castes
         ORDER BY priority ASC`
    );
    return result.rows;
};

const getCasteById = async (id) => {
    const result = await pool.query(
        `SELECT caste_id, name, name_mr, code, priority, status
         FROM castes
         WHERE caste_id = $1`,
        [id]
    );
    return result.rows[0];
};

const updateCaste = async ({ id, name, name_mr, code, priority }) => {
    if (!id || !name || !name_mr || !code || !priority) throw { status: 400, message: "All fields are required" };
    const result = await pool.query(
        `UPDATE castes
         SET name = $1, name_mr = $2, code = $3, priority = $4
         WHERE caste_id = $5
         RETURNING *`,
        [name, name_mr, code, priority, id]
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
