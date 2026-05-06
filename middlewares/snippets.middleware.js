const pool = require("../config/database");

exports._checkPermissions = async (user, permissions) => {
    const result = await pool.query(`
        SELECT 1 FROM users u
            JOIN user_roles ur on u.user_id = ur.user_id
            JOIN roles r ON ur.role_id = r.role_id
            JOIN role_permissions rp ON r.role_id = rp.role_id
            JOIN permissions p ON rp.permission_id = p.permission_id
            WHERE u.user_id = $1 AND p.name = ANY($2)`, [user.user_id, permissions]);
    if (result.rowCount < 1) throw { status: 403, message: "Forbidden" };
}