const pool = require("../../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../../providers/email.provider");
const { v7: uuid7 } = require("uuid");

const SALT_ROUNDS = 10;


// const _sendEmailOTP = async (email, otp) => {
//     await sendEmail(
//         email,
//         "Your OTP — ZP Employee System",
//         `Your OTP is ${otp}. It expires in 10 minutes.`,
//         `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;
//                     padding: 28px; border: 1px solid #ddd; border-radius: 10px;">
//             <h2 style="color: #1a3c6e;">ZP Employee Management</h2>
//             <p>Use the OTP below to verify your identity. It expires in <b>10 minutes</b>.</p>
//             <h1 style="text-align:center; letter-spacing:6px; color:#1a73e8;">${otp}</h1>
//             <p>If you did not request this, please ignore this email.</p>
//             <hr/>
//             <p style="font-size:12px; color:#888;">© 2026 ZP Employee System. All rights reserved.</p>
//         </div>`
//     );
// };

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


// exports.requestOTP = async ({ email }) => {
//     if (!email) throw { status: 400, message: "Email is required" };
// 
//     // Count OTPs requested in the last 10 minutes
//     const recent = await pool.query(
//         `SELECT id FROM auth_otp
//          WHERE email = $1 AND created_at > NOW() - INTERVAL '10 minutes'
//          ORDER BY created_at DESC`,
//         [email]
//     );

//     if (recent.rowCount >= 3) {
//         throw { status: 429, message: "Too many OTP requests. Please wait 10 minutes." };
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const otp_hash = await bcrypt.hash(otp, SALT_ROUNDS);
//     const id = uuid7();

//     // Invalidate any existing unexpired OTPs for this email
//     await pool.query(`DELETE FROM auth_otp WHERE email = $1`, [email]);

//     await pool.query(
//         `INSERT INTO auth_otp (id, email, otp_hash)
//          VALUES ($1, $2, $3)`,
//         [id, email, otp_hash]
//     );

//     await _sendEmailOTP(email, otp);
//     return { message: "OTP sent", id };
// };


// exports.resendOTP = async ({ id, email }) => {
//     if (!id || !email) throw { status: 400, message: "ID and email are required" };

//     const result = await pool.query(
//         `SELECT otp_hash, attempts, expires_at
//          FROM auth_otp WHERE id = $1 AND email = $2`,
//         [id, email]
//     );

//     if (result.rowCount === 0) {
//         // OTP doesn't exist or expired — issue a fresh one
//         return exports.requestOTP({ email });
//     }

//     const record = result.rows[0];

//     if (new Date(record.expires_at) < new Date()) {
//         await pool.query(`DELETE FROM auth_otp WHERE id = $1`, [id]);
//         return exports.requestOTP({ email });
//     }

//     if (record.attempts >= 2) {
//         throw { status: 429, message: "Resend limit reached. Please request a new OTP." };
//     }

//     await pool.query(
//         `UPDATE auth_otp SET attempts = attempts + 1 WHERE id = $1`,
//         [id]
//     );

//     // Re-send the same hashed OTP — we don't store plaintext so we regenerate
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const otp_hash = await bcrypt.hash(otp, SALT_ROUNDS);

//     await pool.query(
//         `UPDATE auth_otp SET otp_hash = $1, expires_at = NOW() + INTERVAL '10 minutes'
//          WHERE id = $2`,
//         [otp_hash, id]
//     );

//     await _sendEmailOTP(email, otp);
//     return { message: "OTP resent", id };
// };

// exports.verifyOTP = async ({ id, otp }) => {
//     if (!id || !otp) throw { status: 400, message: "ID and OTP are required" };

//     // Increment attempts first (prevents brute force even on valid OTP)
//     const result = await pool.query(
//         `UPDATE auth_otp
//          SET attempts = attempts + 1
//          WHERE id = $1
//          RETURNING email, otp_hash, attempts, expires_at`,
//         [id]
//     );

//     if (result.rowCount === 0) {
//         throw { status: 404, message: "OTP not found or already used" };
//     }

//     const record = result.rows[0];

//     if (record.attempts > 6) {
//         throw { status: 429, message: "Max OTP attempts exceeded. Request a new OTP." };
//     }

//     if (new Date(record.expires_at) < new Date()) {
//         await pool.query(`DELETE FROM auth_otp WHERE id = $1`, [id]);
//         throw { status: 401, message: "OTP expired. Please request a new one." };
//     }

//     const isMatch = await bcrypt.compare(otp, record.otp_hash);
//     if (!isMatch) {
//         throw { status: 401, message: "Invalid OTP" };
//     }

//     // OTP is valid — clean up
//     await pool.query(`DELETE FROM auth_otp WHERE email = $1`, [record.email]);

//     // Mark user as verified if they already exist
//     const user = await pool.query(
//         `UPDATE users SET is_verified = TRUE WHERE email = $1 RETURNING id`,
//         [record.email]
//     );

//     return {
//         verified: true,
//         isNewUser: user.rowCount === 0,
//         email: record.email,
//     };
// };

// {
//   email, phone, password,
//   caste_id, role_id,
//   first_name, last_name,
//   zp_id, department_id, post_id, joining_date
// }

exports.addZPAdmin = async (data) => {
    // and PERMISSIONS.name = 'manage_users'
    console.log("Deva", data.user)
    const isAllowed = await pool.query(`SELECT*FROM ROLES JOIN ROLE_PERMISSIONS ON ROLES.ROLE_ID=ROLE_PERMISSIONS.ROLE_ID JOIN PERMISSIONS ON PERMISSIONS.PERMISSION_ID = ROLE_PERMISSIONS.PERMISSION_ID
        join users u on u.ROLE_ID=ROLES.ROLE_ID where u.user_id=$1 AND PERMISSIONS.name = 'Add ZP Admin'`, [data.user.user_id]);
    if (isAllowed.rowCount === 0) {
        throw { status: 403, message: "Forbidden" }
    }
    return this.registerUser(data);

}
exports.addDeptHead = async (data) => {
    // and PERMISSIONS.name = 'manage_users'
    console.log("Deva", data.user)
    const isAllowed = await pool.query(`SELECT * FROM ROLES r 
        JOIN ROLE_PERMISSIONS rp ON r.role_id=rp.role_id
        JOIN PERMISSIONS p ON p.permission_id = rp.permission_id
        JOIN users u ON u.role_id = r.role_id
        WHERE u.user_id=$1 AND p.name = 'Add Department Head'
        `, [data.user.user_id]);
    if (isAllowed.rowCount === 0) {
        throw { status: 403, message: "Forbidden" }
    }

    const isDeptHead = await pool.query(`SELECT * FROM ROLES r WHERE r.role_id=$1 and r.name='Department Head'`, [data.role_id]);
    if (isDeptHead.rowCount === 0) {
        throw { status: 400, message: "Invalid role_id for department head" }
    }

    return this.registerUser(data);

}
// exports.checkVacancies = async (data) => {
//         // const vacancies = await pool.query(`SELECT p.post_id, p.designation, d.name AS department_name,
// }
exports.registerUser = async (data) => {
    const {
        email, phone, password,
        caste_id, role_id,gender_id,
        first_name, last_name,
        zp_id, department_id, post_id, joining_date,
    } = data;

    // All fields mandatory for a proper employee record
    if (!email || !phone || !password || !caste_id || !role_id || !gender_id ||
        !first_name || !zp_id || !department_id || !post_id || !joining_date ) {
        throw {
            status: 400,
            message: "Required: email, phone, password, caste_id, role_id, gender_id, first_name, zp_id, department_id, post_id, joining_date"
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
        console.warn("Registration data:", data); // Debug log to verify incoming data structure

        // Validate foreign keys exist (fail fast with clear messages)
        const [casteCheck, zpCheck, deptCheck, postCheck, roleCheck] = await Promise.all([
            client.query(`SELECT caste_id FROM castes WHERE caste_id = $1 AND status = 1`, [caste_id]),
            client.query(`SELECT zp_id FROM zp WHERE zp_id = $1 AND status = 1`, [zp_id]),
            client.query(`SELECT department_id FROM departments WHERE department_id = $1 AND status = 1`, [department_id]),
            client.query(`SELECT post_id FROM posts WHERE post_id = $1 AND status = 1`, [post_id]),
            client.query(`SELECT role_id, name FROM roles WHERE role_id = $1`, [role_id]),
        ]);

        if (casteCheck.rowCount === 0) throw { status: 400, message: "Invalid caste_id" };
        if (zpCheck.rowCount === 0) throw { status: 400, message: "Invalid zp_id" };
        if (deptCheck.rowCount === 0) throw { status: 400, message: "Invalid department_id" };
        if (postCheck.rowCount === 0) throw { status: 400, message: "Invalid post_id" };
        if (roleCheck.rowCount === 0) throw { status: 400, message: "Invalid role_id" };

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Insert user
        const userResult = await client.query(
            `INSERT INTO users (email, phone, password, caste_id, role_id, zp_id)
             VALUES ($1, $2, $3, $4,$5,$6)
             RETURNING user_id, email`,
            [email, phone, hashedPassword, caste_id, role_id, zp_id]
        );
        const userId = userResult.rows[0].user_id;

        // Insert profile — zp_id stored directly per your schema
        await client.query(
            `INSERT INTO user_profile
                (user_id, first_name, last_name, zp_id, department_id, post_id, joining_date, gender_id,created_by)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [userId, first_name, last_name || "", zp_id, department_id, post_id, joining_date, gender_id, data.user ? data.user.user_id : null]
        );


        await client.query("COMMIT");

        // Return login session immediately
        return exports.loginUser({ email, password });
    } catch (err) {
        await client.query("ROLLBACK");
        throw { status: err.status || 500, message: err.message || "Registration failed" };
    } finally {
        client.release();
    }
};

exports.loginUser = async ({ email, password }) => {
    if (!email || !password) {
        throw { status: 400, message: "Email and password are required" };
    }

    const client = await pool.connect();
    try {
        // Fetch user + profile + roles in one go
        const result = await client.query(
            `SELECT
                u.user_id,
                u.email,
                u.password,
                u.phone,
                u.status,
                u.is_verified,
                up.first_name,
                up.last_name,
                up.zp_id,
                up.department_id,
                up.post_id,
                up.joining_date,
                ARRAY_AGG(DISTINCT r.name) AS roles
             FROM users u
             LEFT JOIN user_profile up ON u.user_id = up.user_id
             LEFT JOIN roles r ON u.role_id = r.role_id
             WHERE u.email = $1
             GROUP BY u.user_id, up.first_name, up.last_name,
                      up.zp_id, up.department_id, up.post_id, up.joining_date`,
            [email]
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

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw { status: 401, message: "Invalid credentials" };
        }

        const { accessToken, refreshToken } = await _issueTokens(client, user.user_id, user.email);

        // Never send password hash to client
        const { password: _pwd, ...safeUser } = user;

        return { accessToken, refreshToken, user: safeUser };
    } catch (err) {
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
            `SELECT rt.user_id
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

exports.initiateAuth = async ({ email }) => {
    if (!email) throw { status: 400, message: "Email is required" };

    const result = await pool.query(
        `SELECT is_verified FROM users WHERE email = $1`, [email]
    );

    return {
        isNewUser: result.rowCount === 0,
        isVerified: result.rowCount > 0 ? result.rows[0].is_verified : false,
    };
};