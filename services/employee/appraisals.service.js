const pool = require('../../config/database.js');

exports.initiateAppraisal = async ({ user, year_from, year_to, start_date, end_date }) => {
    // console.log("Initiating appraisal with data:", { user, year_from, year_to, start_date, end_date });
    if (!year_from || !year_to || !start_date || !end_date) {
        throw { status: 400, message: "All fields (year_from, year_to, start_date, end_date) are required" };
    }
    if (!user) {
        throw { status: 400, message: "User information is required" };
    }
    const client = await pool.connect();
    let result;
    try {

        const hasAuthority = await client.query(
            `SELECT user_id, zp_id FROM users u
            JOIN role_permissions rp ON u.role_id = rp.role_id
            JOIN permissions p ON rp.permission_id = p.permission_id
            WHERE u.user_id = $1 AND p.name = 'process_appraisals'`,
            [user.user_id]
        );

        if (!hasAuthority.rows.length || hasAuthority.rows[0].zp_id !== user.zp_id) {
            throw { status: 403, message: "Insufficient permissions" };
        }

        result = await client.query(
            `INSERT INTO appraisal_cycles (zp_id,year_from,year_to,start_date,end_date) VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT(zp_id, year_from, year_to) DO UPDATE SET start_date = EXCLUDED.start_date, end_date = EXCLUDED.end_date
            RETURNING cycle_id`,
            [user.zp_id, year_from, year_to, start_date, end_date]
        );
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    } finally {
        client.release();
    }

    return result.rows[0] || [];
}

exports.initiateAppraisalEmployee = async ({ user, cycle_id, employee_user_id, reporting_officer_id, reviewing_officer_id, establishment_user_id, report_period_from, report_period_to }) => {

    if (!cycle_id || !employee_user_id || !reporting_officer_id || !reviewing_officer_id || !establishment_user_id || !report_period_from || !report_period_to) {
        throw { status: 400, message: "All fields are required" };
    }

    if (!user) {
        throw { status: 400, message: "User information is required" };
    }
    const client = await pool.connect();
    let result;
    try {

        const [hasAuthority, isReporitingOfficer, isReviewingOfficer, isEstablishmentOfficer] = await Promise.all([
            client.query(
                `SELECT u.user_id FROM users u
                JOIN role_permissions rp ON u.role_id = rp.role_id
                JOIN permissions p ON rp.permission_id = p.permission_id
                WHERE u.user_id = $1 AND p.name = 'process_appraisals'`,
                [user.user_id]
            ),
            client.query(
                `SELECT u.user_id FROM users u
                JOIN user_roles ur ON u.user_id = ur.user_id
                JOIN roles r ON ur.role_id = r.role_id
                WHERE u.user_id = $1 AND r.name = 'reporting_officer'`,
                [reporting_officer_id]
            ),
            client.query(
                `SELECT u.user_id FROM users u
                JOIN user_roles ur ON u.user_id = ur.user_id
                JOIN roles r ON ur.role_id = r.role_id
                WHERE u.user_id = $1 AND r.name = 'reviewing_officer'`,
                [reviewing_officer_id]
            ),
            client.query(
                `SELECT u.user_id FROM users u
                JOIN user_roles ur ON u.user_id = ur.user_id
                JOIN roles r ON ur.role_id = r.role_id
                WHERE u.user_id = $1 AND r.name = 'establishment_officer'`,
                [establishment_user_id])
        ]);
        // console.log(hasAuthority.rows, isReporitingOfficer.rows, isReviewingOfficer.rows)
        if (isEstablishmentOfficer.rows.length === 0) {
            throw { status: 403, message: "Establishment officer role mismatch" };
        }
        if (!hasAuthority.rows.length || !isReporitingOfficer.rows.length || !isReviewingOfficer.rows.length) {
            const message = hasAuthority.rows.length ? (!isReviewingOfficer.rows.length ? "Reviewing officer role mismatch" : "Reporting officer role mismatch") : "Insufficient permissions";

            throw { status: 403, message: message };
        }

        result = await client.query(
            `INSERT INTO appraisals (cycle_id, employee_user_id, reporting_officer_id, reviewing_officer_id, establishment_user_id, report_period_from, report_period_to) VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT(cycle_id, employee_user_id) DO UPDATE SET reporting_officer_id = EXCLUDED.reporting_officer_id, reviewing_officer_id = EXCLUDED.reviewing_officer_id,establishment_user_id = EXCLUDED.establishment_user_id, report_period_from = EXCLUDED.report_period_from, report_period_to = EXCLUDED.report_period_to
            RETURNING appraisal_id`,
            [cycle_id, employee_user_id, reporting_officer_id, reviewing_officer_id, establishment_user_id, report_period_from, report_period_to]
        );
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    } finally {
        client.release();
    }

    return result.rows[0] || [];
}

exports.getSection1AppraisalEmployee = async (user) => {

    if (!user) {
        throw { status: 400, message: "No such user found" };
    }

    const client = await pool.connect();
    let result;
    try {

        isValidReq = await client.query(
            `
            SELECT * FROM users u 
            JOIN user_roles ur ON u.user_id = ur.user_id
            JOIN roles r ON ur.role_id = r.role_id
            WHERE u.user_id = $1 AND u.zp_id = $2 AND r.name = 'employee'
            `,
            [user.user_id, user.zp_id]
        );
        if (isValidReq.rows.length === 0) {
            throw { status: 403, message: "Access Denied" };
        }
        result = await client.query(`
            SELECT u.user_id, ep.first_name, ep.last_name, ep.dob, ep.current_office_joining_date, CONCAT(rto_ep.first_name, ' ', rto_ep.last_name) AS reporting_officer_name, CONCAT(rvo_ep.first_name, ' ', rvo_ep.last_name) AS reviewing_officer_name, d.name AS department_name, a.appraisal_id
            FROM users u JOIN employee_profiles ep ON u.user_id = ep.user_id
            JOIN departments d ON ep.department_id = d.department_id
            JOIN appraisals a ON u.user_id = a.employee_user_id
            JOIN users rto ON a.reporting_officer_id = rto.user_id
            JOIN employee_profiles rto_ep ON rto.user_id = rto_ep.user_id
            JOIN users rvo ON a.reviewing_officer_id = rvo.user_id
            JOIN employee_profiles rvo_ep ON rvo.user_id = rvo_ep.user_id
            WHERE u.user_id = $1
            `, [user.user_id]);

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    } finally {
        client.release();
    }

    return result.rows[0] || [];
}

exports.section1AppraisalEmployee = async ({ user, appraisal_id, asset_liability_submitted_date, asset_liability_place, establishment_officer_name, establishment_officer_designation, leave_type, from_date, to_date, remarks, entry_type, period_from, period_to, institution, subject, place, training_date }) => {

    if (!user || !appraisal_id || !asset_liability_submitted_date || !asset_liability_place || !establishment_officer_name || !establishment_officer_designation || !leave_type || !from_date || !to_date || !remarks || !entry_type || !period_from || !period_to || !institution || !subject || !place || !training_date) {
        throw { status: 400, message: "All fields are required" };
    }

    if (!user) {
        throw { status: 400, message: "User information is required" };
    }
    const client = await pool.connect();
    let result = [];
    try {

        const [isAppraisal] = await Promise.all([
            client.query(
                `SELECT appraisal_id FROM appraisals WHERE appraisal_id = $1 AND employee_user_id = $2`,
                [appraisal_id, user.user_id]
            )
        ]);

        if (isAppraisal.rows.length === 0) {
            throw { status: 403, message: "No such appraisal found for employee" };
        }

        const res = await client.query(
            `INSERT INTO appraisal_section1 (appraisal_id, asset_liability_submitted_date, asset_liability_place, establishment_officer_name, establishment_officer_designation, submitted_at) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING appraisal_id`,
            [appraisal_id, asset_liability_submitted_date, asset_liability_place, establishment_officer_name, establishment_officer_designation, new Date()]
        );
        const leaves = await client.query(
            `INSERT INTO appraisal_leave_entries (appraisal_id, leave_type, from_date, to_date, remarks, entry_type) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING leave_entry_id`,
            [appraisal_id, leave_type, from_date, to_date, remarks, entry_type]
        );
        const trainings = await client.query(
            `INSERT INTO appraisal_training_entries (appraisal_id, period_from, period_to, institution, subject, place, training_date) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING training_entry_id`,
            [appraisal_id, period_from, period_to, institution, subject, place, training_date]
        );
        result.push(res.rows[0]);
        result.push(leaves.rows[0]);
        result.push(trainings.rows[0]);

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    } finally {
        client.release();
    }

    return result || [];
}

exports.section2AppraisalEmployee = async ({ user, appraisal_id, task_description, allocated_targets, noteworthy_works, difficulties_faced, training_needs, asset_liability_submitted, asset_liability_submit_date, place }) => {

    if (!user || !appraisal_id || !task_description || !allocated_targets || !noteworthy_works || !difficulties_faced || !training_needs || !asset_liability_submitted || !asset_liability_submit_date || !place) {
        throw { status: 400, message: "All fields are required" };
    }

    if (!user) {
        throw { status: 400, message: "User information is required" };
    }
    const client = await pool.connect();
    let result;
    try {

        const [isAppraisal] = await Promise.all([
            client.query(
                `SELECT appraisal_id FROM appraisals WHERE appraisal_id = $1 AND employee_user_id = $2`,
                [appraisal_id, user.user_id]
            )
        ]);

        if (isAppraisal.rows.length === 0) {
            throw { status: 403, message: "No such appraisal found for employee" };
        }

        result = await client.query(
            `INSERT INTO appraisal_section2 (
appraisal_id, task_description, allocated_targets, noteworthy_works, difficulties_faced, training_needs, asset_liability_submitted,asset_liability_submit_date, place, submitted_at, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            ON CONFLICT(appraisal_id) DO UPDATE SET task_description = EXCLUDED.task_description, allocated_targets = EXCLUDED.allocated_targets, noteworthy_works = EXCLUDED.noteworthy_works, difficulties_faced = EXCLUDED.difficulties_faced, training_needs = EXCLUDED.training_needs, asset_liability_submitted = EXCLUDED.asset_liability_submitted, asset_liability_submit_date = EXCLUDED.asset_liability_submit_date, place = EXCLUDED.place, submitted_at = EXCLUDED.submitted_at
            RETURNING appraisal_id`,
            [appraisal_id, task_description, allocated_targets, noteworthy_works, difficulties_faced, training_needs, asset_liability_submitted, asset_liability_submit_date, place, new Date(), new Date()]
        );

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    } finally {
        client.release();
    }

    return result.rows || [];
}

exports.section3AppraisalEmployee = async ({ user, appraisal_id,
    agrees_with_self_appraisal, factual_remarks, noteworthy_remarks, failure_remarks, agrees_training_needs, work_accomplishment_score, work_quality_score, work_exceptional_score, attitude_score, responsibility_score, personality_score, emotional_stability_score, communication_score, timeliness_score, knowledge_score, strategic_planning_score, decision_making_score, initiative_score, coordination_score, character_integrity_remarks, overall_assessment, health_status, overall_gradation, place, submitted_at }) => {

    if (!user || !appraisal_id || !agrees_with_self_appraisal || !factual_remarks || !noteworthy_remarks || !failure_remarks || !agrees_training_needs || !work_accomplishment_score || !work_quality_score || !work_exceptional_score || !attitude_score || !responsibility_score || !personality_score || !emotional_stability_score || !communication_score || !timeliness_score || !knowledge_score || !strategic_planning_score || !decision_making_score || !initiative_score || !coordination_score || !character_integrity_remarks || !overall_assessment || !health_status || !overall_gradation || !place || !submitted_at) {
        throw { status: 400, message: "All fields are required" };
    }

    if (!user) {
        throw { status: 400, message: "User information is required" };
    }
    const client = await pool.connect();
    let result;
    try {
        console.log("Section 3 appraisal data:", user, appraisal_id,);
        const [isAppraisal] = await Promise.all([
            client.query(
                `SELECT appraisal_id FROM appraisals WHERE appraisal_id = $1 AND reporting_officer_id = $2`,
                [appraisal_id, user.user_id]
            )
        ]);

        if (isAppraisal.rows.length === 0) {
            throw { status: 403, message: "No such Reporting Officer" };
        }

        result = await client.query(
            `INSERT INTO appraisal_section3 (appraisal_id,
agrees_with_self_appraisal, factual_remarks, noteworthy_remarks, failure_remarks, agrees_training_needs, work_accomplishment_score, work_quality_score, work_exceptional_score, attitude_score, responsibility_score, personality_score, emotional_stability_score, communication_score, timeliness_score, knowledge_score, strategic_planning_score, decision_making_score, initiative_score, coordination_score, character_integrity_remarks, overall_assessment, health_status, overall_gradation, place, submitted_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26)
            ON CONFLICT(appraisal_id) DO UPDATE SET agrees_with_self_appraisal = EXCLUDED.agrees_with_self_appraisal, factual_remarks = EXCLUDED.factual_remarks, noteworthy_remarks = EXCLUDED.noteworthy_remarks, failure_remarks = EXCLUDED.failure_remarks, agrees_training_needs = EXCLUDED.agrees_training_needs, work_accomplishment_score = EXCLUDED.work_accomplishment_score, work_quality_score = EXCLUDED.work_quality_score, work_exceptional_score = EXCLUDED.work_exceptional_score, attitude_score = EXCLUDED.attitude_score, responsibility_score = EXCLUDED.responsibility_score, personality_score = EXCLUDED.personality_score, emotional_stability_score = EXCLUDED.emotional_stability_score, communication_score = EXCLUDED.communication_score, timeliness_score = EXCLUDED.timeliness_score, knowledge_score = EXCLUDED.knowledge_score, strategic_planning_score = EXCLUDED.strategic_planning_score, decision_making_score = EXCLUDED.decision_making_score, initiative_score = EXCLUDED.initiative_score, coordination_score = EXCLUDED.coordination_score, character_integrity_remarks = EXCLUDED.character_integrity_remarks, overall_assessment = EXCLUDED.overall_assessment, health_status = EXCLUDED.health_status, overall_gradation = EXCLUDED.overall_gradation, place = EXCLUDED.place, submitted_at = EXCLUDED.submitted_at
            RETURNING appraisal_id`,
            [appraisal_id, agrees_with_self_appraisal, factual_remarks, noteworthy_remarks, failure_remarks, agrees_training_needs, work_accomplishment_score, work_quality_score, work_exceptional_score, attitude_score, responsibility_score, personality_score, emotional_stability_score, communication_score, timeliness_score, knowledge_score, strategic_planning_score, decision_making_score, initiative_score, coordination_score, character_integrity_remarks, overall_assessment, health_status, overall_gradation, place, submitted_at]
        );
        await client.query(`UPDATE appraisals SET reporting_submitted_at = NOW() WHERE appraisal_id = $1`, [appraisal_id]);

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    } finally {
        client.release();
    }

    return result.rows || [];
}

exports.section4AppraisalEmployee = async ({ user, appraisal_id,
    agrees_with_reporting_officer, disagreement_details, overall_assessment, overall_gradation, place }) => {

    if (!user || !appraisal_id || !agrees_with_reporting_officer || !disagreement_details || !overall_assessment || !overall_gradation || !place) {
        throw { status: 400, message: "All fields are required" };
    }

    if (!user) {
        throw { status: 400, message: "User information is required" };
    }
    const client = await pool.connect();
    let result;
    try {

        const [isAppraisal] = await Promise.all([
            client.query(
                `SELECT appraisal_id FROM appraisals WHERE appraisal_id = $1 AND reviewing_officer_id = $2`,
                [appraisal_id, user.user_id]
            )
        ]);

        if (isAppraisal.rows.length === 0) {
            throw { status: 403, message: "No such appraisal found for reviewing officer" };
        }

        result = await client.query(
            `INSERT INTO appraisal_section4 (appraisal_id,
        agrees_with_reporting_officer,  disagreement_details, overall_assessment, overall_gradation, place, submitted_at) VALUES ($1, $2, $3, $4, $5, $6, $7)
ON CONFLICT(appraisal_id) DO UPDATE SET agrees_with_reporting_officer = EXCLUDED.agrees_with_reporting_officer, disagreement_details = EXCLUDED.disagreement_details, overall_assessment = EXCLUDED.overall_assessment, overall_gradation = EXCLUDED.overall_gradation, place = EXCLUDED.place, submitted_at = EXCLUDED.submitted_at
            RETURNING appraisal_id`,
            [appraisal_id, agrees_with_reporting_officer, disagreement_details, overall_assessment, overall_gradation, place, new Date()]
        );
        await client.query(`UPDATE appraisals SET reviewing_submitted_at = NOW() WHERE appraisal_id = $1`, [appraisal_id]);

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    } finally {
        client.release();
    }

    return result.rows || [];
}
