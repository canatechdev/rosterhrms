const pool = require('../../config/database');

const createDistrict = async (name,name_mr) => {
    const result = await pool.query(
        'INSERT INTO districts (name,name_mr) VALUES ($1, $2) RETURNING *',
        [name,name_mr]
    );
    return result.rows[0];
};

const getDistricts = async () => {
    const result = await pool.query('SELECT * FROM districts ORDER BY district_id ASC');
    return result.rows;
};

const getDistrictById = async (id) => {
    const result = await pool.query('SELECT * FROM districts WHERE district_id = $1', [id]);
    return result.rows[0];
};

const updateDistrict = async (id, name, status,name_mr) => {
    const result = await pool.query(
        'UPDATE districts SET name = $1, name_mr = $2 WHERE district_id = $3 RETURNING *',
        [name,name_mr, id]
    );
    return result.rows[0];
};

const deleteDistrict = async (id) => {
    await pool.query('UPDATE districts SET status = 0 WHERE district_id = $1', [id]);
};

module.exports = {
    createDistrict,
    getDistricts,
    getDistrictById,
    updateDistrict,
    deleteDistrict,
};
