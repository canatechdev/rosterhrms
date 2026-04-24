const ExcelJS = require('exceljs');
const xlsx = require('xlsx');
const db = require('../../config/database');
// const logger = require('../../lib/logger');
const bcrypt = require('bcrypt');

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
            db.query('SELECT role_id, name FROM roles ORDER BY name'),
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
        mainSheet.mergeCells(`A${currentRow}:J${currentRow}`);
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
            '- Password will be hashed automatically on import',
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
            'Password *', 'Employee ID *', 'Aadhaar Number *',
            'Role *', 'Department *', 'ZP *'
        ];
        mainSheet.getRow(HEADER_ROW).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        mainSheet.getRow(HEADER_ROW).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
        mainSheet.getRow(HEADER_ROW).height = 20;

        [20, 20, 30, 15, 15, 15, 20, 20, 25, 25]
            .forEach((w, i) => { mainSheet.getColumn(i + 1).width = w; });

        // ── Dropdowns for 200 rows ────────────────────────────────────────────
        const FIRST_DATA_ROW = HEADER_ROW + 1;
        for (let i = 0; i < 200; i++) {
            const row = FIRST_DATA_ROW + i;

            // Role → col H
            if (roles.length) mainSheet.getCell(`H${row}`).dataValidation = {
                type: 'list', allowBlank: true,
                formulae: [`Lists!$A$${LIST_START}:$A$${LIST_START + roles.length - 1}`],
                showErrorMessage: true, errorTitle: 'Invalid Role', error: 'Select from dropdown',
            };
            // Department → col I
            if (depts.length) mainSheet.getCell(`I${row}`).dataValidation = {
                type: 'list', allowBlank: true,
                formulae: [`Lists!$B$${LIST_START}:$B$${LIST_START + depts.length - 1}`],
                showErrorMessage: true, errorTitle: 'Invalid Department', error: 'Select from dropdown',
            };
            // ZP → col J
            if (zps.length) mainSheet.getCell(`J${row}`).dataValidation = {
                type: 'list', allowBlank: true,
                formulae: [`Lists!$C$${LIST_START}:$C$${LIST_START + zps.length - 1}`],
                showErrorMessage: true, errorTitle: 'Invalid ZP', error: 'Select from dropdown',
            };
        }

        // ── Sample row ────────────────────────────────────────────────────────
        mainSheet.getRow(FIRST_DATA_ROW).values = [
            'Chaitanya', 'K', 'chaitanya@gmail.com', '9321990141',
            'plainPassword123', 'EMP001', '777777444414',
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

        // range: 9 = skip title(1) + instructions(6) + spacer(1) + header(1) + sample(1) = row 11
        const rows = xlsx.utils.sheet_to_json(sheet, {
            header: ['first_name', 'last_name', 'email', 'phone', 'password',
                'employee_id', 'aadhar_number', 'role', 'department', 'zp'],
            range: 9,
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

                // ── Field validations ─────────────────────────────────────────
                const user = {
                    first_name: cleanValue(row.first_name),
                    last_name: cleanValue(row.last_name),
                    email: cleanValue(row.email),
                    phone: cleanValue(row.phone),
                    password: cleanValue(row.password),
                    employee_id: cleanValue(row.employee_id),
                    aadhar_number: cleanValue(row.aadhar_number),
                    role_id, department_id, zp_id,
                };

                if (!user.first_name) throw new Error('First Name is required');
                if (!user.last_name) throw new Error('Last Name is required');
                if (!user.email) throw new Error('Email is required');
                if (!user.phone) throw new Error('Phone is required');
                if (!user.password) throw new Error('Password is required');
                if (!user.employee_id) throw new Error('Employee ID is required');
                if (!user.aadhar_number) throw new Error('Aadhaar is required');

                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email))
                    throw new Error(`Invalid email: ${user.email}`);
                if (!/^\d{10}$/.test(user.phone))
                    throw new Error('Phone must be 10 digits');
                if (!/^\d{12}$/.test(user.aadhar_number))
                    throw new Error('Aadhaar must be 12 digits');

                // ── Hash password & insert ────────────────────────────────────
                user.password = await bcrypt.hash(user.password, 10);

                await db.query('BEGIN');
                const result = await db.query(
                    `INSERT INTO users (email, phone, password, role_id, zp_id)
                     VALUES ($1, $2, $3, $4, $5)
                    ON CONFLICT (email) DO UPDATE SET phone = EXCLUDED.phone, password = EXCLUDED.password, role_id = EXCLUDED.role_id, zp_id = EXCLUDED.zp_id, updated_at = NOW()
                     RETURNING user_id`,
                    [user.email, user.phone, user.password, user.role_id, user.zp_id]
                );
                const userId = result.rows[0].user_id;

                await db.query(
                    `INSERT INTO employee_profiles (user_id, first_name, last_name, employee_id, aadhar_number, department_id)
                     VALUES ($1, $2, $3, $4, $5, $6)
                     ON CONFLICT (aadhar_number) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, employee_id = EXCLUDED.employee_id, aadhar_number = EXCLUDED.aadhar_number, department_id = EXCLUDED.department_id, updated_at = NOW()`,
                    [userId, user.first_name, user.last_name, user.employee_id, user.aadhar_number, user.department_id]
                );
                await db.query('COMMIT');

                inserted.push({ employee_id: user.employee_id, db_id: userId });

            } catch (err) {
                await db.query('ROLLBACK');
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

module.exports = { generateTemplate, processUploadedFile };