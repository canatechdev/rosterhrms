const pool = require("../config/database");
exports.logAudit = async (action, cadre_post_id, vacancy_id,zp_id) => {
    await pool.query(`
        INSERT INTO audit_logs (action, cadre_post_id, vacancy_id, zp_id)
        VALUES ($1, $2, $3, $4)
    `, [action, cadre_post_id, vacancy_id, zp_id]);
};