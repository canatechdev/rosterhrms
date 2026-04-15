const pool = require('../../config/database');

exports.getMasters = async ({ master_name }) => {
    if (!master_name) throw { status: 400, message: "Master Name is required" };
    console.log(master_name)
    const result = await pool.query('SELECT enum_id, name FROM enum_master WHERE master_name = $1  ORDER BY sort_index', [master_name]);
    return result.rows;
};