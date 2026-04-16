const pool = require("../../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../../providers/email.provider");
const { v7: uuid7 } = require("uuid");

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
    await _checkPermission(data.user.user_id, "add_zp_admin");

    const isZPAdmin = await pool.query(`SELECT 1 FROM ROLES r WHERE r.role_id=$1 and r.name='zp_admin'`, [data.role_id]);
    if (isZPAdmin.rowCount === 0) {
        throw { status: 400, message: "Invalid role_id for ZP admin" }
    }
    return registerUser(data);
}
exports.addDeptHead = async (data) => {
    await _checkPermission(data.user.user_id, "add_department_head");

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
    await _checkPermission(data.user.user_id, "add_employee");

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
        email, phone, password,
        role_id,
        first_name, last_name, aadhar_number,
        zp_id, department_id, user
    } = data;

    // All fields mandatory for a proper employee record
    if (!email || !phone || !password || !role_id ||
        !first_name || !zp_id) {
        throw {
            status: 400,
            message: "Required: email, phone, password, role_id, first_name, zp_id, department_id"
        };
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
            `INSERT INTO users (email, phone, password, role_id, zp_id)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING user_id, email`,
            [email, phone, hashedPassword, role_id, zp_id]
        );
        const userId = userResult.rows[0].user_id;

        // Insert profile — zp_id stored directly per your schema
        await client.query(
            `INSERT INTO employee_profiles
                (user_id, first_name, last_name,department_id, created_by, aadhar_number)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [userId, first_name, last_name, department_id || null, user.user_id, aadhar_number || null]
        );

        await client.query("COMMIT");
        return userResult.rows;
    } catch (err) {
        await client.query("ROLLBACK");
        throw { status: err.status || 500, message: err.message || "Registration failed" };
    } finally {
        client.release();
    }
};

exports.addEmployee = async (data) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Check permission (Department Head only)
        const check = await client.query(`
            SELECT 1 FROM users u
            JOIN roles r ON u.role_id = r.role_id
            JOIN role_permissions rp ON r.role_id = rp.role_id
            JOIN permissions p ON p.permission_id = rp.permission_id
            WHERE u.user_id = $1 
            AND r.name = 'dept_head'
            AND p.name = 'add_employee'
        `, [data.user.user_id]);

        if (check.rowCount === 0) {
            throw { status: 403, message: "Only Department Head can add employee" };
        }

        //  Insert into users table
        const userRes = await client.query(`
            INSERT INTO users (email, phone, password, zp_id, caste_id, role_id)
            VALUES ($1, $2, $3, $4, $5, 5)  
            RETURNING user_id
        `, [
            data.email,
            data.phone,
            data.password,
            data.zp_id,
            data.caste_id
        ]);

        const newUserId = userRes.rows[0].user_id;

        // Insert into user_profile
        await client.query(`
            INSERT INTO user_profile 
            (user_id, first_name, last_name, zp_id, department_id, joining_date, created_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
            newUserId,
            data.first_name,
            data.last_name,
            data.zp_id,
            data.department_id,
            data.joining_date,
            data.user.user_id
        ]);

        await client.query("COMMIT");

        return { message: "Employee added successfully" };

    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
};

exports.addEmployee = async (data) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Check permission (Department Head only)
        const check = await client.query(`
            SELECT 1 FROM users u
            JOIN roles r ON u.role_id = r.role_id
            JOIN role_permissions rp ON r.role_id = rp.role_id
            JOIN permissions p ON p.permission_id = rp.permission_id
            WHERE u.user_id = $1 
            AND r.name = 'Department Head'
            AND p.name = 'Add Employee'
        `, [data.user.user_id]);

        if (check.rowCount === 0) {
            throw { status: 403, message: "Only Department Head can add employee" };
        }

        //  Insert into users table
        const userRes = await client.query(`
            INSERT INTO users (email, phone, password, zp_id, caste_id, role_id)
            VALUES ($1, $2, $3, $4, $5, 5)  
            RETURNING user_id
        `, [
            data.email,
            data.phone,
            data.password,
            data.zp_id,
            data.caste_id
        ]);

        const newUserId = userRes.rows[0].user_id;

        // Insert into user_profile
        await client.query(`
            INSERT INTO user_profile 
            (user_id, first_name, last_name, zp_id, department_id, joining_date, created_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
            newUserId,
            data.first_name,
            data.last_name,
            data.zp_id,
            data.department_id,
            data.joining_date,
            data.user.user_id
        ]);

        await client.query("COMMIT");

        return { message: "Employee added successfully" };

    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
};

exports.loginUser = async ({ email, password, zp_name }) => {
    if (!email || !password) {
        throw { status: 400, message: "Email and password are required" };
    }

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const zpDetails = await client.query(`SELECT zp_id FROM zp WHERE name = $1`, [zp_name]);
        if (zpDetails.rowCount === 0) {
            throw { status: 400, message: "Invalid ZP in URL" };
        }

        // Fetch user + profile + roles in one go
        const isValidEmail = await client.query(`SELECT password FROM users WHERE email=$1 AND zp_id=$2`, [email, zpDetails.rows[0].zp_id]);
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
                z.name ZP_name,
                up.first_name,
                up.middle_name,
                up.last_name,
                up.joining_date,
                ARRAY_AGG(DISTINCT r.name) AS roles
             FROM users u
             LEFT JOIN employee_profiles up ON u.user_id = up.user_id
             LEFT JOIN roles r ON u.role_id = r.role_id
             LEFT JOIN zp z ON u.zp_id = z.zp_id
             WHERE u.email = $1 AND u.zp_id=$2
             GROUP BY u.user_id, up.first_name, up.last_name,up.middle_name,
                      z.name, u.zp_id, up.department_id, up.post_id, up.joining_date`,
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