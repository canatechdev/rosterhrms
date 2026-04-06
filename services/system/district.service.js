const pool = require('../../config/database');

const createDistrict = async (name) => {
    const result = await pool.query(
        'INSERT INTO districts (name) VALUES ($1) RETURNING *',
        [name]
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

const updateDistrict = async (id, name, status) => {
    const result = await pool.query(
        'UPDATE districts SET name = $1 WHERE district_id = $2 RETURNING *',
        [name, id]
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
