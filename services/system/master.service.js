const pool = require('../../config/database');

exports.getMasters = async ({ master_name }) => {
    if (!master_name) throw { status: 400, message: "Master Name is required" };
    console.log(master_name)
    const result = await pool.query('SELECT enum_id, name FROM enum_master WHERE master_name = $1  ORDER BY sort_index', [master_name]);
    return result.rows;
};

exports.createMaster = async ({ master_name }, { name }) => {
    if (!name) throw { status: 400, message: "Name is required" };
    
    const result = await pool.query(`INSERT INTO enum_master (master_name, name) VALUES ($1, $2)
        ON CONFLICT (master_name, name) DO NOTHING
        RETURNING enum_id`, [master_name, name]);
    return result.rows[0];
};

exports.updateMaster = async ({ master_name }, { name, enum_id }) => {
    if (!name|| !enum_id) throw { status: 400, message: "Name and Enum ID are required" };
    const isConflict=await pool.query(`SELECT enum_id FROM enum_master WHERE master_name = $1 AND name = $2 AND enum_id != $3`, [master_name, name, enum_id]);
    if(isConflict.rows.length>0) throw { status: 400, message: "Another entry with same name exists" };

    const result = await pool.query(`UPDATE enum_master SET name = $2 WHERE master_name = $1 AND enum_id = $3
    RETURNING *`, [master_name, name, enum_id]);
    return result.rows[0];
};

exports.deleteMaster = async ({ master_name }, { name }) => {
    if (!name) throw { status: 400, message: "Name is required" };
    const result = await pool.query(`DELETE FROM enum_master WHERE master_name = $1 AND name = $2
        RETURNING enum_id`, [master_name, name]);
    return result.rows[0];
};