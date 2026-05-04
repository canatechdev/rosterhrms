const ExcelJS = require('exceljs');
const xlsx = require('xlsx');
const db = require('../../config/database');
const { sendEmail } = require('../../providers/email.provider');
// const logger = require('../../lib/logger');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

function generateTempPassword(length = 10) {
    // Creates a reasonably user-friendly temporary password
    // (avoids ambiguous chars like 0/O, 1/I/l)
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
    const bytes = crypto.randomBytes(length);
    let out = '';
    for (let i = 0; i < length; i++) out += alphabet[bytes[i] % alphabet.length];
    return out;
}

function cleanValue(v) {
    if (v === undefined || v === null || v === '') return null;
    return String(v).trim();
}

function extractRows(result) {
    return Array.isArray(result) ? result : result?.rows || result?.[0] || [];
}

// ── GET /api/users/template ──────────────────────────────────────────────────
async function generateTemplate(req, res) {
    try {
        const [rolesResult, deptsResult, zpsResult] = await Promise.all([
            db.query("SELECT role_id, name FROM roles WHERE name='employee'"),
            db.query('SELECT department_id, name FROM departments WHERE status = 1 ORDER BY name'),
            db.query('SELECT zp_id, name FROM zp WHERE status = 1 ORDER BY name'), // adjust table/col names
        ]);

        const roles = extractRows(rolesResult);
        const depts = extractRows(deptsResult);
        const zps = extractRows(zpsResult);

        const workbook = new ExcelJS.Workbook();
        const mainSheet = workbook.addWorksheet('Users Template');
        const listSheet = workbook.addWorksheet('Lists');
        listSheet.state = 'hidden';

        // ── Populate Lists sheet ──────────────────────────────────────────────
        const LIST_START = 2;
        listSheet.getCell('A1').value = 'Roles';
        roles.forEach((r, i) => { listSheet.getCell(`A${LIST_START + i}`).value = r.name; });

        listSheet.getCell('B1').value = 'Departments';
        depts.forEach((d, i) => { listSheet.getCell(`B${LIST_START + i}`).value = d.name; });

        listSheet.getCell('C1').value = 'ZPs';
        zps.forEach((z, i) => { listSheet.getCell(`C${LIST_START + i}`).value = z.name; });

        // ── Title ─────────────────────────────────────────────────────────────
        let currentRow = 1;
        // Template has 9 columns (A..I)
        mainSheet.mergeCells(`A${currentRow}:I${currentRow}`);
        mainSheet.getCell(`A${currentRow}`).value = 'USER REGISTRATION UPLOAD TEMPLATE';
        mainSheet.getCell(`A${currentRow}`).font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } };
        mainSheet.getCell(`A${currentRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1A56A0' } };
        mainSheet.getCell(`A${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
        mainSheet.getRow(currentRow).height = 30;
        currentRow++;

        // ── Instructions ──────────────────────────────────────────────────────
        [
            'Instructions:',
            '- Fields marked with * are mandatory',
            '- Use dropdowns to select Role, Department, and ZP',
            '- Aadhaar must be exactly 12 digits | Phone must be 10 digits',
            '- Employee ID must be unique',
            '- Password will be automatically GENERATED and emailed to the user',
        ].forEach((line) => {
            mainSheet.getRow(currentRow).values = [line];
            mainSheet.getRow(currentRow).font = { italic: true, color: { argb: 'FFCC0000' }, size: 10 };
            currentRow++;
        });
        currentRow++; // spacer

        // ── Headers ───────────────────────────────────────────────────────────
        const HEADER_ROW = currentRow;
        mainSheet.getRow(HEADER_ROW).values = [
            'First Name *', 'Last Name *', 'Email *', 'Phone *',
            'Employee ID *', 'Aadhaar Number *',
            'Role *', 'Department *', 'ZP *'
        ];
        mainSheet.getRow(HEADER_ROW).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        mainSheet.getRow(HEADER_ROW).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
        mainSheet.getRow(HEADER_ROW).height = 20;

        [20, 20, 30, 15, 15, 15, 20, 20, 25]
            .forEach((w, i) => { mainSheet.getColumn(i + 1).width = w; });

        // ── Dropdowns for 200 rows ────────────────────────────────────────────
        const FIRST_DATA_ROW = HEADER_ROW + 1;
        for (let i = 0; i < 200; i++) {
            const row = FIRST_DATA_ROW + i;

            // Role → col G
            if (roles.length) mainSheet.getCell(`G${row}`).dataValidation = {
                type: 'list', allowBlank: true,
                formulae: [`Lists!$A$${LIST_START}:$A$${LIST_START + roles.length - 1}`],
                showErrorMessage: true, errorTitle: 'Invalid Role', error: 'Select from dropdown',
            };
            // Department → col H
            if (depts.length) mainSheet.getCell(`H${row}`).dataValidation = {
                type: 'list', allowBlank: true,
                formulae: [`Lists!$B$${LIST_START}:$B$${LIST_START + depts.length - 1}`],
                showErrorMessage: true, errorTitle: 'Invalid Department', error: 'Select from dropdown',
            };
            // ZP → col I
            if (zps.length) mainSheet.getCell(`I${row}`).dataValidation = {
                type: 'list', allowBlank: true,
                formulae: [`Lists!$C$${LIST_START}:$C$${LIST_START + zps.length - 1}`],
                showErrorMessage: true, errorTitle: 'Invalid ZP', error: 'Select from dropdown',
            };
        }

        // ── Sample row ────────────────────────────────────────────────────────
        mainSheet.getRow(FIRST_DATA_ROW).values = [
            'Chaitanya', 'K', 'chaitanya@gmail.com', '9321990141',
            'EMP001', '777777444414',
            roles[0]?.name || 'Employee',
            depts[0]?.name || 'PWD',
            zps[0]?.name || 'Pune',
        ];
        mainSheet.getRow(FIRST_DATA_ROW).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0F4FF' } };
        mainSheet.getRow(FIRST_DATA_ROW).font = { italic: true, color: { argb: 'FF555555' } };

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="User_Upload_Template.xlsx"');
        await workbook.xlsx.write(res);
        res.end();

    } catch (err) {
        // logger.error('Template generation failed:', err);
        res.status(500).json({ success: false, message: err.message });
    }
}

// ── POST /api/users/upload ───────────────────────────────────────────────────
async function processUploadedFile(req, res) {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    try {
        const workbook = xlsx.readFile(req.file.path);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        // start after sample row (first real data row is 11)
        const rows = xlsx.utils.sheet_to_json(sheet, {
            header: ['first_name', 'last_name', 'email', 'phone',
                'employee_id', 'aadhar_number', 'role', 'department', 'zp'],
            range: 10,
        });

        // ── Load lookup maps ──────────────────────────────────────────────────
        const [rolesResult, deptsResult, zpsResult] = await Promise.all([
            db.query('SELECT role_id, name FROM roles'),
            db.query('SELECT department_id, name FROM departments WHERE status = 1'),
            db.query('SELECT zp_id, name FROM zp WHERE status = 1'),
        ]);

        const roleMap = new Map(extractRows(rolesResult).map(r => [r.name.toLowerCase(), r.role_id]));
        const deptMap = new Map(extractRows(deptsResult).map(d => [d.name.toLowerCase(), d.department_id]));
        const zpMap = new Map(extractRows(zpsResult).map(z => [z.name.toLowerCase(), z.zp_id]));

        const inserted = [], failedRows = [];

        for (const [index, row] of rows.entries()) {
            if (!row.first_name && !row.email && !row.employee_id) continue; // skip empty

            const EXCEL_ROW_NUM = index + 11;
            let transactionStarted = false;
            try {
                // ── Resolve FK IDs ────────────────────────────────────────────
                const roleName = cleanValue(row.role);
                const deptName = cleanValue(row.department);
                const zpName = cleanValue(row.zp);

                if (!roleName) throw new Error('Role is required');
                if (!deptName) throw new Error('Department is required');
                if (!zpName) throw new Error('ZP is required');

                const role_id = roleMap.get(roleName.toLowerCase());
                const department_id = deptMap.get(deptName.toLowerCase());
                const zp_id = zpMap.get(zpName.toLowerCase());

                if (!role_id) throw new Error(`Role "${roleName}" not found`);
                if (!department_id) throw new Error(`Department "${deptName}" not found`);
                if (!zp_id) throw new Error(`ZP "${zpName}" not found`);

                const plainPassword = generateTempPassword(10);
                // ── Field validations ─────────────────────────────────────────
                const user = {
                    first_name: cleanValue(row.first_name),
                    last_name: cleanValue(row.last_name),
                    email: cleanValue(row.email),
                    phone: cleanValue(row.phone),
                    employee_id: cleanValue(row.employee_id),
                    aadhar_number: cleanValue(row.aadhar_number),
                    role_id, department_id, zp_id,
                };

                if (!user.first_name) throw new Error('First Name is required');
                if (!user.last_name) throw new Error('Last Name is required');
                if (!user.email) throw new Error('Email is required');
                if (!user.phone) throw new Error('Phone is required');
                if (!user.employee_id) throw new Error('Employee ID is required');
                if (!user.aadhar_number) throw new Error('Aadhaar is required');

                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email))
                    throw new Error(`Invalid email: ${user.email}`);
                if (!/^\d{10}$/.test(user.phone))
                    throw new Error('Phone must be 10 digits');
                if (!/^\d{12}$/.test(user.aadhar_number))
                    throw new Error('Aadhaar must be 12 digits');

                // ── Hash password & insert ────────────────────────────────────
                const hashedPassword = await bcrypt.hash(plainPassword, 10);

                await db.query('BEGIN');
                transactionStarted = true;
                const result = await db.query(
                    `INSERT INTO users (email, phone, password, role_id, zp_id)
                     VALUES ($1, $2, $3, $4, $5)
                    ON CONFLICT (email) DO UPDATE SET phone = EXCLUDED.phone, password = EXCLUDED.password, role_id = EXCLUDED.role_id, zp_id = EXCLUDED.zp_id, updated_at = NOW()
                     RETURNING user_id`,
                    [user.email, user.phone, hashedPassword, user.role_id, user.zp_id]
                );
                const userId = result.rows[0].user_id;

                await db.query(
                    `INSERT INTO employee_profiles (user_id, first_name, last_name, employee_id, aadhar_number, department_id)
                     VALUES ($1, $2, $3, $4, $5, $6)
                     ON CONFLICT (aadhar_number) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, employee_id = EXCLUDED.employee_id, aadhar_number = EXCLUDED.aadhar_number, department_id = EXCLUDED.department_id, updated_at = NOW()`,
                    [userId, user.first_name, user.last_name, user.employee_id, user.aadhar_number, user.department_id]
                );
                await db.query('COMMIT');
                transactionStarted = false;
                await sendWelcomeCredentials({
                    email: user.email,
                    password: plainPassword, // send plain temp password in email
                    name: user.first_name + ' ' + user.last_name,
                    changePasswordUrl: `${process.env.BASE_URL}/change_password`
                });
                inserted.push({ employee_id: user.employee_id, db_id: userId });

            } catch (err) {
                if (transactionStarted) {
                    try { await db.query('ROLLBACK'); } catch (_) { /* ignore */ }
                }
                // logger.error(`Row ${EXCEL_ROW_NUM} failed:`, err.message);
                failedRows.push({ rowNumber: EXCEL_ROW_NUM, data: row, error: err.message });
            }
        }

        return res.status(200).json({
            success: true,
            message: `${inserted.length} user(s) inserted`,
            data: { inserted_count: inserted.length, failed_count: failedRows.length, inserted, failed: failedRows },
        });

    } catch (err) {
        // logger.error('User upload error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
}
async function sendWelcomeCredentials(data) {
    const { email, password, name, message, changePasswordUrl } = data;
    if (!email || !password || !name || !changePasswordUrl) {
        throw { status: 400, message: "email, password, name and changePasswordUrl are required to send welcome email" };
    }
    await sendEmail(
        email,
        message,
        `Hi ${name}, your login: ${email} / ${password}. Change it at: ${changePasswordUrl}`,
        `
<div style="background:#f4f6f9;padding:28px 16px;">
<div style="max-width:400px;margin:0 auto;font-family:Arial,sans-serif;">

  <div style="background:#0f172a;border-radius:12px 12px 0 0;padding:28px 28px 24px;">
    <div style="display:flex;align-items:center;gap:7px;margin-bottom:22px;">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="2.5" stroke="#7dd3fc" stroke-width="1.8"/><path d="M2 8.5l10 5.5 10-5.5" stroke="#7dd3fc" stroke-width="1.8" stroke-linecap="round"/></svg>
      <span style="color:#7dd3fc;font-size:12px;font-weight:700;letter-spacing:2.5px;">ZP-ROASTER</span>
    </div>
    <div style="width:32px;height:2px;background:#3b82f6;border-radius:2px;margin-bottom:14px;"></div>
    <h1 style="color:#f8fafc;font-size:18px;font-weight:700;margin:0 0 6px;line-height:1.4;">Welcome aboard, ${name}.</h1>
    <p style="color:#94a3b8;font-size:13px;margin:0;line-height:1.5;">New credentials have been generated and Account is ready to use.</p>
  </div>

  <div style="background:#fff;padding:24px 28px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
    <p style="font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:1.2px;margin:0 0 12px;font-weight:600;">Your login details</p>
    <div style="margin-bottom:10px;">
      <p style="font-size:11px;color:#94a3b8;margin:0 0 3px;">Email address</p>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:10px 14px;">
        <span style="font-size:13px;color:#1e293b;font-family:monospace;font-weight:600;">${email}</span>
      </div>
    </div>
    <div style="margin-bottom:24px;">
      <p style="font-size:11px;color:#94a3b8;margin:0 0 3px;">Temporary password</p>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:10px 14px;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:13px;color:#1e293b;font-family:monospace;font-weight:600;">${password}</span>
        <span style="font-size:10px;background:#fef3c7;color:#92400e;padding:2px 7px;border-radius:4px;font-weight:600;">TEMPORARY</span>
      </div>
    </div>
    <a href="${changePasswordUrl}" style="display:block;text-align:center;background:#1d4ed8;color:#fff;text-decoration:none;padding:13px 20px;border-radius:8px;font-size:13px;font-weight:700;">Set a new password →</a>
  </div>

  <div style="background:#fffbeb;border:1px solid #fde68a;border-left:3px solid #f59e0b;padding:12px 16px;">
    <p style="font-size:12px;color:#78350f;margin:0;line-height:1.6;">
      This temporary password expires in <strong>24 hours</strong>. If you didn't expect this email, no action is needed.
    </p>
  </div>

  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;padding:16px 28px;display:flex;justify-content:space-between;align-items:center;">
    <span style="font-size:11px;color:#94a3b8;">© ${new Date().getFullYear()} ZP-Roaster </span>
    <span style="font-size:11px;color:#cbd5e1;">Account notification</span>
  </div>

</div>
</div>
        `
    );
};
module.exports = { generateTemplate, processUploadedFile, sendWelcomeCredentials };