const pool = require("../../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { _checkPermissions } = require("../../middlewares/snippets.middleware");
// const { sendEmail } = require("../../providers/email.provider");
const { v7: uuid7 } = require("uuid");
const { sendWelcomeCredentials } = require("../../controllers/Excel/ExcelOps");
const SALT_ROUNDS = 10;

const _issueTokens = async (client, user_id, email) => {
    // console.log('Deva', userId, email)
    const accessToken = jwt.sign(
        { user_id, email },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
        { user_id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: `${process.env.REFRESH_EXPIRES_DAYS}d` }
    );

    await client.query(
        `INSERT INTO refresh_tokens (user_id, token, expires_at)
         VALUES ($1, $2, NOW() + INTERVAL '${process.env.REFRESH_EXPIRES_DAYS} days')`,
        [user_id, refreshToken]
    );

    return { accessToken, refreshToken };
};

const _checkPermission = async (userId, permissionName) => {
    const res = await pool.query(
        `SELECT 1 FROM users u
         JOIN roles r ON u.role_id = r.role_id
         JOIN role_permissions rp ON r.role_id = rp.role_id
         JOIN permissions p ON rp.permission_id = p.permission_id
         WHERE u.user_id = $1 AND p.name = $2`,
        [userId, permissionName]
    );
    if (res.rowCount === 0) throw { status: 403, message: "Forbidden" };
};

exports.addZPAdmin = async (data) => {
    await _checkPermissions(data.user, ["add_zp_admin"]);
    data.is_verified = true; // ZP Admins are verified by default
    const role = await pool.query(`SELECT role_id FROM roles WHERE name='zp_admin'`);
    if (role.rowCount === 0) {
        throw { status: 400, message: "Invalid role_id for ZP admin" }
    }
    const isZPAdmin = await pool.query(`SELECT 1 FROM ROLES r WHERE r.role_id=$1 and r.name='zp_admin'`, [data.role_id]);
    if (isZPAdmin.rowCount === 0) {
        throw { status: 400, message: "Invalid role_id for ZP admin" }
    }
    return registerUser(data);
}
exports.addDeptHead = async (data) => {
    await _checkPermissions(data.user, ["add_department_head"]);
    data.is_verified = true; // DEPARTMENT HEADS are verified by default

    if (!data.department_id) {
        throw { status: 400, message: "department_id is required for department head" }
    }
    const isDept = await pool.query("select 1 from departments where department_id=$1 and status=1", [data.department_id]);
    if (isDept.rowCount === 0) {
        throw { status: 400, message: "Invalid department_id" }
    }
    const isDeptHead = await pool.query(`SELECT 1 FROM ROLES r WHERE r.role_id=$1 and r.name='dept_head'`, [data.role_id]);
    if (isDeptHead.rowCount === 0) {
        throw { status: 400, message: "Invalid role_id for department head" }
    }

    return registerUser(data);

}
exports.registerEmployee = async (data) => {
    await _checkPermissions(data.user, ["add_employee"]);

    if (!data.department_id) {
        throw { status: 400, message: "department_id is required for Employee" }
    }
    if (!data.aadhar_number || data.aadhar_number.length !== 12) {
        throw { status: 400, message: "Invalid aadhar_number" }
    }

    const [isDept, isDuplicate, isEmpRole] = await Promise.all([
        await pool.query("SELECT 1 FROM departments WHERE department_id=$1 AND status=1", [data.department_id]),
        await pool.query(`SELECT 1 FROM users u JOIN employee_profiles ep ON u.user_id=ep.user_id WHERE ep.aadhar_number=$1`, [data.aadhar_number]),
        await pool.query(`SELECT 1 FROM roles r WHERE r.role_id=$1 AND r.name='employee'`, [data.role_id])
    ]);

    switch (true) {
        case isDept.rowCount === 0:
            throw { status: 400, message: "Invalid department_id" }
        case isEmpRole.rowCount === 0:
            throw { status: 400, message: "Invalid role_id for Employee" }
        case isDuplicate.rowCount !== 0:
            throw { status: 400, message: "Aadhar Number Exists" }
        default:
            break;
    }

    return registerUser(data);
}

// MAIN FUNCTION
const registerUser = async (data) => {
    const {
        email, phone, role_id,
        first_name, last_name, aadhar_number,
        zp_id, department_id, user, employee_id, is_verified
    } = data;
    let { password } = data;
    // All fields mandatory for a proper employee record
    if (!email || !phone || !role_id ||
        !first_name || !zp_id) {
        throw {
            status: 400,
            message: "Required: email, phone, role_id, first_name, zp_id, department_id"
        };
    }
    if (!password) {
        password = uuid7().replace(/-/g, '').slice(0, 10); // Generate a random 10 char password
    }
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // Duplicate check
        const existing = await client.query(
            `SELECT user_id FROM users WHERE email = $1`, [email]
        );
        if (existing.rowCount > 0) {
            throw { status: 409, message: "User with this email already exists" };
        }

        const [zpCheck, roleCheck] = await Promise.all([
            client.query(`SELECT zp_id FROM zp WHERE zp_id = $1 AND status = 1`, [zp_id]),
            client.query(`SELECT role_id, name FROM roles WHERE role_id = $1`, [role_id])
        ]);

        if (zpCheck.rowCount === 0) throw { status: 400, message: "Invalid zp_id" };
        if (roleCheck.rowCount === 0) throw { status: 400, message: "Invalid role_id" };

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Insert user
        const userResult = await client.query(
            `INSERT INTO users (email, phone, password, role_id, zp_id, is_verified)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING user_id, email`,
            [email, phone, hashedPassword, role_id, zp_id, is_verified || false]
        );
        const userId = userResult.rows[0].user_id;
        await client.query(`INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)`, [userId, role_id]);
        // Insert profile — zp_id stored directly per your schema
        await client.query(
            `INSERT INTO employee_profiles
                (user_id, first_name, last_name,department_id, created_by, aadhar_number, employee_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [userId, first_name, last_name, department_id || null, user.user_id, aadhar_number || null, employee_id || null]
        );
        if (roleCheck.rows[0].name === 'employee') {
            await sendWelcomeCredentials({
                message: "Welcome to ZP-Roaster — Your account is ready",
                email,
                password,
                name: first_name,
                changePasswordUrl: `${process.env.BASE_URL}/change_password`
            });
        }
        await client.query("COMMIT");
        return userResult.rows;
    } catch (err) {
        await client.query("ROLLBACK");
        throw { status: err.status || 500, message: err.message || "Registration failed" };
    } finally {
        client.release();
    }
};

exports.loginSuperAdmin = async ({ email, password }) => {
    const client = await pool.connect();
    await client.query("BEGIN");
    try {
        const su_admin = await client.query(`SELECT user_id, password FROM users WHERE
            role_id = (SELECT role_id FROM roles WHERE name='super_admin') AND email = $1`, [email]);
        if (su_admin.rowCount === 0) {
            throw { status: 404, message: "No Such Super Admin" };
        }
        const isMatch = await bcrypt.compare(password, su_admin.rows[0].password);
        if (!isMatch) {
            throw { status: 401, message: "Invalid credentials" };
        }
        const result = await client.query(
            `SELECT
                u.user_id,
                u.email,
                u.phone,
                u.status,
                ARRAY_AGG(DISTINCT r.name) AS roles,
                ARRAY_AGG(DISTINCT p.name) AS permissions
             FROM users u
             LEFT JOIN roles r ON u.role_id = r.role_id
             JOIN role_permissions rp ON u.role_id = rp.role_id
             JOIN permissions p ON rp.permission_id = p.permission_id
             WHERE u.email = $1 AND r.name='super_admin'
             GROUP BY u.user_id, r.name`,
            [email]
        );

        if (result.rowCount === 0) {
            throw { status: 401, message: "Invalid credentials" };
        }

        const user = result.rows[0];

        if (user.status !== 1) {
            throw { status: 403, message: "Account is inactive. Contact administrator." };
        }

        const { accessToken, refreshToken } = await _issueTokens(client, user.user_id, user.email);

        // Never send password hash to client
        const { password: _pwd, status: status, ...safeUser } = user;
        await client.query("COMMIT");
        return { accessToken, refreshToken, user: safeUser };

    } catch (err) {
        await client.query("ROLLBACK");
        throw { status: err.status || 500, message: err.message || "Login failed" };
    } finally {
        client.release();
    }
}

exports.loginUser = async ({ email, password, zp_name }) => {
    if (!email || !password) {
        throw { status: 400, message: "Email/EMP_ID and password are required" };
    }

    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const zpDetails = await client.query(`SELECT zp_id FROM zp WHERE name = $1`, [zp_name]);

        if (zpDetails.rowCount === 0) {
            throw { status: 400, message: "Invalid ZP in URL" };
        }

        const isValidEmail = await client.query(`SELECT password FROM users u JOIN employee_profiles ep ON u.user_id=ep.user_id WHERE (email=$1 OR employee_id=$1) AND zp_id=$2`, [email, zpDetails.rows[0].zp_id]);
        console.log(isValidEmail.rows)
        if (isValidEmail.rowCount === 0) {
            throw { status: 401, message: "Invalid credentials" };
        }
        const isMatch = await bcrypt.compare(password, isValidEmail.rows[0].password);
        if (!isMatch) {
            throw { status: 401, message: "Invalid credentials" };
        }

      const result = await client.query(
  `SELECT
      u.user_id,
      u.email,
      u.phone,
      u.is_verified,
      u.status,
      u.zp_id,
      z.name ZP_name,
      up.first_name,
      up.middle_name,
      up.last_name,
      up.joining_date,
      r.name AS roles,
      ARRAY_AGG(DISTINCT p.name) AS permissions
   FROM users u
   LEFT JOIN employee_profiles up ON u.user_id = up.user_id
   LEFT JOIN roles r ON u.role_id = r.role_id
   LEFT JOIN zp z ON u.zp_id = z.zp_id
   JOIN role_permissions rp ON u.role_id = rp.role_id
   JOIN permissions p ON rp.permission_id = p.permission_id
   WHERE u.email = $1 AND u.zp_id=$2
   GROUP BY 
      u.user_id, u.zp_id,
      up.first_name, up.last_name, up.middle_name,
      r.name, z.name,
      up.department_id, up.post_id, up.joining_date`,
  [email, zpDetails.rows[0].zp_id]
);
        const result = await client.query(
            `SELECT
                u.user_id,
                u.email,
                u.phone,
                u.is_verified,
                u.status,
                z.name ZP_name,
                ep.first_name,
                ep.middle_name,
                ep.last_name,
                ep.joining_date,
                r.name AS roles,
                ARRAY_AGG(DISTINCT p.name) AS permissions
             FROM users u
             LEFT JOIN employee_profiles ep ON u.user_id = ep.user_id
             LEFT JOIN roles r ON u.role_id = r.role_id
             LEFT JOIN zp z ON u.zp_id = z.zp_id
             JOIN role_permissions rp ON u.role_id = rp.role_id
             JOIN permissions p ON rp.permission_id = p.permission_id
             WHERE (u.email = $1 OR (ep.employee_id=$1 AND ep.employee_id IS NOT NULL)) AND u.zp_id=$2
             GROUP BY u.user_id, ep.first_name, ep.last_name,ep.middle_name, r.name, z.name, u.zp_id, ep.department_id, ep.post_id, ep.joining_date`,
            [email, zpDetails.rows[0].zp_id]
        );

        if (result.rowCount === 0) {
            throw { status: 401, message: "Invalid credentials" };
        }

        // if (result.rows[0].is_verified === false) {
        //     throw { status: 402, message: "Verify Email first" };
        // }

        const user = result.rows[0];

        if (user.status !== 1) {
            throw { status: 403, message: "Account is inactive. Contact administrator." };
        }

        const { accessToken, refreshToken } = await _issueTokens(client, user.user_id, user.email);

        // Never send password hash to client
        const { password: _pwd, status: status, ...safeUser } = user;
        await client.query("COMMIT");
        return { accessToken, refreshToken, user: safeUser };
    } catch (err) {
        await client.query("ROLLBACK");
        throw { status: err.status || 500, message: err.message || "Login failed" };
    } finally {
        client.release();
    }
};

exports.refreshToken = async (cookies) => {
    const { refreshToken } = cookies;
    if (!refreshToken) throw { status: 401, message: "No refresh token provided" };
    // console.log("REFRESH TOKEN SERVICE")
    const client = await pool.connect();
    try {
        const stored = await client.query(
            `SELECT rt.user_id, u.email
             FROM refresh_tokens rt
             JOIN users u ON rt.user_id = u.user_id
             WHERE rt.token = $1 AND rt.expires_at > NOW()`,
            [refreshToken]
        );

        if (stored.rowCount === 0) {
            throw { status: 401, message: "Invalid or expired refresh token" };
        }

        // Verify signature
        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Rotate refresh token (invalidate old, issue new)
        await client.query(
            `DELETE FROM refresh_tokens WHERE token = $1`, [refreshToken]
        );

        const { accessToken, refreshToken: newRefreshToken } =
            await _issueTokens(client, payload.user_id, stored.rows[0].email);

        return { accessToken, refreshToken: newRefreshToken };
    } catch (err) {
        throw { status: err.status || 401, message: err.message || "Token refresh failed" };
    } finally {
        client.release();
    }
};

exports.logoutUser = async (cookies) => {
    const { refreshToken } = cookies;
    if (refreshToken) {
        await pool.query(
            `DELETE FROM refresh_tokens WHERE token = $1`, [refreshToken]
        );
    }
    return { message: "Logged out successfully" };
};

// exports.initiateAuth = async ({ email }) => {
//     if (!email) throw { status: 400, message: "Email is required" };

//     const result = await pool.query(
//         `SELECT is_verified FROM users WHERE email = $1`, [email]
//     );

//     return {
//         isNewUser: result.rowCount === 0,
//         isVerified: result.rowCount > 0 ? result.rows[0].is_verified : false,
//     };
// };

exports.changePassword = async ({ old_password, new_password, user }) => {
    if (old_password == new_password) throw { status: 400, message: "New password cannot be same as current password" };

    if (!old_password || !new_password) {
        throw { status: 400, message: "Old and new passwords are required" };
    }
    const client = await pool.connect();
    try {
        const res = await client.query(`SELECT password FROM users WHERE user_id = $1`, [user.user_id]);
        if (res.rowCount === 0) {
            throw { status: 404, message: "User not found" };
        }

        const isMatch = await bcrypt.compare(old_password, res.rows[0].password);
        if (!isMatch) {
            throw { status: 401, message: "Old password is incorrect" };
        }
        const hashedPassword = await bcrypt.hash(new_password, SALT_ROUNDS);
        await client.query(`UPDATE users SET password = $1, is_verified = true WHERE user_id = $2`, [hashedPassword, user.user_id]);
        return { message: "Password changed successfully" };

    } catch (err) {
        throw { status: err.status || 500, message: err.message || "Password change failed" };
    } finally {
        client.release();
    }
}

exports.resetPassword = async ({ user, user_id }) => {
    const client = await pool.connect();
    try {

        await _checkPermissions(user, ['reset_password']);

        const res = await client.query(`SELECT email, ep.first_name FROM users u JOIN employee_profiles ep ON u.user_id = ep.user_id WHERE u.user_id = $1`, [user_id]);
        if (res.rowCount === 0) {
            throw { status: 404, message: "User not found" };
        }
        const new_password = uuid7().replace(/-/g, '').slice(0, 10); // Generate a random 10 char password
        const hashedPassword = await bcrypt.hash(new_password, SALT_ROUNDS);

        await client.query(`UPDATE users SET password = $1, is_verified = false WHERE user_id = $2`, [hashedPassword, user_id]);

        await sendWelcomeCredentials({
            message: "Your password has been successfully reset. Kindly change your password",
            email: res.rows[0].email,
            password: new_password,
            name: res.rows[0].first_name,
            changePasswordUrl: `${process.env.BASE_URL}/change_password`
        });

        return { message: "Password reset successfully" };

    } catch (err) {
        throw { status: err.status || 500, message: err.message || "Password reset failed" };
    } finally {
        client.release();
    }
}