const pool = require('../../config/database.js');

exports.savePersonalInfoStep1 = async ({ user_id, salutation, first_name, middle_name, last_name, full_name_marathi, father_full_name, mother_full_name, name_changed, previous_name, blood_group, gender, dob, phone, pan_number, email, govt_email, religion, caste_id, caste_validity_cert, caste_validity_date, mother_tongue }) => {
    if (!user_id || !salutation || !first_name || !middle_name || !last_name || !blood_group || !gender || !dob || !phone || !pan_number || !email || !religion || !caste_id || !caste_validity_date) {
        throw { status: 400, message: "All fields are required" };
    }
    const client = await pool.connect();
    let udpated;
    try {
        const stepCheck = await client.query(
            `SELECT user_id, current_step, current_section FROM employee_profiles WHERE user_id = $1`,
            [user_id]
        );

        if (!stepCheck.rows.length || stepCheck.rows[0].current_section < 1) {
            throw { status: 404, message: "Registration Incomplete" };
        }

        _id = stepCheck.rows[0].user_id;
        udpated = await client.query(
            `UPDATE employee_profiles SET 
        salutation = $1, first_name = $2, middle_name = $3, last_name = $4, full_name_marathi = $5, father_full_name = $6, mother_full_name = $7, name_changed = $8, previous_name = $9, blood_group = $10, gender_id =        $11, dob = $12, pan_number = $13, govt_email = $14, religion = $15, caste_id = $16, caste_validity_cert = $17, caste_validity_date = $18, mother_tongue = $19, 
        
        current_step = 2, current_section=1
        
        WHERE user_id = $20
        RETURNING user_id, first_name, middle_name, last_name, blood_group, gender_id, dob, pan_number, aadhar_number,  religion, mother_tongue
        `,
            [salutation, first_name, middle_name, last_name, full_name_marathi, father_full_name, mother_full_name, name_changed, previous_name, blood_group, gender, dob, pan_number, govt_email, religion, caste_id, caste_validity_cert, caste_validity_date, mother_tongue, _id]
        );
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    } finally {
        client.release();
    }

    return udpated.rows[0] || [];
}
exports.getPersonalInfoStep1 = async ({ user_id }) => {
    if (!user_id) { throw { status: 400, message: "User ID is required" }; }
    const result = await pool.query(
        `SELECT user_id, salutation, first_name, middle_name, last_name, full_name_marathi, father_full_name, mother_full_name, name_changed, previous_name, blood_group, gender_id, dob, u.phone, pan_number, u.email, govt_email, religion, caste_id, caste_validity_cert, caste_validity_date, mother_tongue 
        FROM employee_profiles
        JOIN users u USING(user_id)
        WHERE user_id = $1`,
        [user_id]
    );
    return result.rows[0] || [];
}


exports.savePersonalInfoStep2 = async ({ user_id, first_appointment_type, cadre_service_name, dept_entry_exam_date }) => {
    // console.log(user_id, first_appointment_type, cadre_service_name, dept_entry_exam_date)
    if (!user_id || !first_appointment_type || !cadre_service_name || !dept_entry_exam_date) {
        throw { status: 400, message: "All fields are required" };
    }
    let updated
    // console.log(aadhar_number, user_id)
    const client = await pool.connect();
    try {
        const stepCheck = await client.query(
            `SELECT user_id, current_step, current_section FROM employee_profiles WHERE user_id = $1`,
            [user_id]
        );

        if (!stepCheck.rows.length || stepCheck.rows[0].current_section < 1) {
            throw { status: 404, message: "Registration Incomplete" };
        }

        _id = stepCheck.rows[0].user_id;
        updated = await client.query(
            `UPDATE employee_profiles SET
        first_appointment_type =$1, cadre_service_name=$2, dept_entry_exam_date=$3
        WHERE user_id = $4
        RETURNING user_id, first_appointment_type, cadre_service_name, dept_entry_exam_date
        `,
            [first_appointment_type, cadre_service_name, dept_entry_exam_date, _id]
        );
        await client.query(
            `UPDATE employee_profiles SET current_step = 3,current_section=1  WHERE user_id = $1`,
            [_id]
        );
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    } finally {
        client.release();
    }
    return updated.rows[0] || [];
}
exports.getPersonalInfoStep2 = async ({ user_id }) => {
    if (!user_id) { throw { status: 400, message: "User ID is required" }; }
    const result = await pool.query(
        `SELECT user_id, first_appointment_type, cadre_service_name, dept_entry_exam_date
        FROM employee_profiles
        WHERE user_id = $1`,
        [user_id]
    );
    return result.rows[0] || [];
}

exports.savePersonalInfoStep3 = async ({ user_id, govt_service_joining_date, current_office_joining_date, retirement_date, sevarth_number, shaalarth_number, height_cm, identification_mark }) => {
    if (!user_id || !govt_service_joining_date || !current_office_joining_date || !retirement_date || !sevarth_number || !shaalarth_number || !height_cm || !identification_mark) {
        throw { status: 400, message: "All fields are required" };
    }
    const client = await pool.connect();
    let updated;
    try {
        // console.log(aadhar_number, user_id)
        const stepCheck = await client.query(
            `SELECT user_id, current_step, current_section FROM employee_profiles WHERE user_id = $1`,
            [user_id]
        );

        if (!stepCheck.rows.length || stepCheck.rows[0].current_section < 1) {
            throw { status: 404, message: "Registration Incomplete" };
        }

        _id = stepCheck.rows[0].user_id;
        updated = await client.query(
            `UPDATE employee_profiles SET
        govt_service_joining_date =$1, current_office_joining_date =$2, retirement_date=$3, sevarth_number=$4, shaalarth_number=$5, height_cm=$6, identification_mark=$7
        WHERE user_id = $8
        RETURNING user_id, govt_service_joining_date, current_office_joining_date, retirement_date, sevarth_number, shaalarth_number, height_cm, identification_mark
        `,
            [govt_service_joining_date, current_office_joining_date, retirement_date, sevarth_number, shaalarth_number, height_cm, identification_mark, _id]
        );
        await client.query(
            `UPDATE employee_profiles SET current_step = 4,current_section=1  WHERE user_id = $1`,
            [_id]
        );
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    } finally {
        client.release();
    }
    return updated.rows[0] || [];
}
exports.getPersonalInfoStep3 = async ({ user_id }) => {
    if (!user_id) { throw { status: 400, message: "User ID is required" }; }
    const result = await pool.query(
        `SELECT user_id, govt_service_joining_date, current_office_joining_date, retirement_date, sevarth_number, shaalarth_number, height_cm, identification_mark
        FROM employee_profiles
        WHERE user_id = $1`,
        [user_id]
    );
    return result.rows[0] || [];
}

exports.savePersonalInfoStep4 = async ({ user_id, is_ex_serviceman, has_domicile_cert, spouse_in_service, spouse_service_type, spouse_office_type, spouse_office_details, spouse_employee_no, has_pran, pran_number, gpf_number, ppo_number, ppo_date }) => {
    if (!user_id || !is_ex_serviceman || !has_domicile_cert || !spouse_in_service || !spouse_service_type || !spouse_office_type || !spouse_office_details || !spouse_employee_no || !has_pran || !pran_number || !gpf_number || !ppo_number || !ppo_date) {
        throw { status: 400, message: "All fields are required" };
    }
    const client = await pool.connect();
    let updated;
    try {
        // console.log('AADHA', 'aadhar_number', user_id)
        const stepCheck = await client.query(
            `SELECT user_id, current_step, current_section FROM employee_profiles WHERE user_id = $1`,
            [user_id]
        );

        if (!stepCheck.rows.length || stepCheck.rows[0].current_section < 1) {
            throw { status: 404, message: "Registration Incomplete" };
        }

        _id = stepCheck.rows[0].user_id;
        updated = await client.query(
            `UPDATE employee_profiles SET
        is_ex_serviceman=$1, has_domicile_cert=$2, spouse_in_service=$3, spouse_service_type=$4, spouse_office_type=$5, spouse_office_details=$6, spouse_employee_no=$7, has_pran=$8, pran_number=$9, gpf_number=$10, ppo_number=$11, ppo_date=$12,
        current_step = 5,current_section=1
        WHERE user_id = $13
        RETURNING user_id, is_ex_serviceman, has_domicile_cert, spouse_in_service, spouse_service_type, spouse_office_type, spouse_office_details, spouse_employee_no, has_pran, pran_number, gpf_number, ppo_number, ppo_date
        `,
            [is_ex_serviceman, has_domicile_cert, spouse_in_service, spouse_service_type, spouse_office_type, spouse_office_details, spouse_employee_no, has_pran, pran_number, gpf_number, ppo_number, ppo_date, _id]
        );
    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    } finally {
        client.release();
    }
    return updated.rows[0] || [];
}
// exports.getPersonalInfoStep4 = async ({ user_id }) => {
//     if (!user_id) { throw { status: 400, message: "User ID is required" }; }
//     const result = await pool.query(
//         `SELECT user_id, is_ex_serviceman, has_domicile_cert, spouse_in_service, spouse_service_type, spouse_office_type, spouse_office_details, spouse_employee_no, has_pran, pran_number, gpf_number, ppo_number, ppo_date
//         FROM employee_profiles
//         WHERE user_id = $1`,
//         [user_id]
//     );
//     return result.rows[0] || [];
// }

exports.savePersonalInfoStep5 = async ({ user_id,
    marital_status, marriage_cert, birth_cert, aadhar, pan, caste_validity, gazette_name_change }) => {

    if (!user_id || !marriage_cert || !birth_cert || !aadhar || !pan || !caste_validity || !gazette_name_change) {
        throw { status: 400, message: "All fields are required" };
    }
    const client = await pool.connect();
    let marriage_cert_res, birth_cert_res, aadhar_res, pan_res, caste_validity_res, gazette_name_change_res;
    try {
        // console.log(aadhar_number, user_id)
        const stepCheck = await client.query(
            `SELECT user_id, current_step, current_section FROM employee_profiles WHERE user_id = $1`,
            [user_id]
        );

        if (!stepCheck.rows.length || stepCheck.rows[0].current_section < 1) {
            throw { status: 404, message: "Registration Incomplete" };
        }

        // _id = stepCheck.rows[0].user_id;
        [marriage_cert_res, birth_cert_res, aadhar_res, pan_res, caste_validity_res, gazette_name_change_res] = await Promise.all([
            await client.query(`INSERT INTO employee_documents (user_id, doc_type, file_url) VALUES ($1, $2, $3) RETURNING *`, [user_id, 'marriage_cert', marriage_cert]),
            await client.query(`INSERT INTO employee_documents (user_id, doc_type, file_url) VALUES ($1, $2, $3) RETURNING *`, [user_id, 'birth_cert', birth_cert]),
            await client.query(`INSERT INTO employee_documents (user_id, doc_type, file_url) VALUES ($1, $2, $3) RETURNING *`, [user_id, 'aadhar', aadhar]),
            await client.query(`INSERT INTO employee_documents (user_id, doc_type, file_url) VALUES ($1, $2, $3) RETURNING *`, [user_id, 'pan', pan]),
            await client.query(`INSERT INTO employee_documents (user_id, doc_type, file_url) VALUES ($1, $2, $3) RETURNING *`, [user_id, 'caste_validity', caste_validity]),
            await client.query(`INSERT INTO employee_documents (user_id, doc_type, file_url) VALUES ($1, $2, $3) RETURNING *`, [user_id, 'gazette_name_change', gazette_name_change])
        ]);
        await client.query(
            `UPDATE employee_profiles SET marital_status=$2, current_step = 6,current_section=1  WHERE user_id = $1`,
            [user_id, marital_status]
        );
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    } finally {
        client.release();
    }
    return [marriage_cert_res.rows[0], birth_cert_res.rows[0], aadhar_res.rows[0], pan_res.rows[0], caste_validity_res.rows[0], gazette_name_change_res.rows[0]] || [];
}

exports.savePersonalInfoStep6 = async ({ user_id, photo, signature }) => {

    if (!user_id || !photo || !signature) {
        throw { status: 400, message: "All fields are required" };
    }
    const client = await pool.connect();
    let photo_res, signature_res;
    try {
        // console.log(aadhar_number, user_id)
        const stepCheck = await client.query(
            `SELECT user_id, current_step, current_section FROM employee_profiles WHERE user_id = $1`,
            [user_id]
        );

        if (!stepCheck.rows.length || stepCheck.rows[0].current_section < 1) {
            throw { status: 404, message: "Registration Incomplete" };
        }

        // _id = stepCheck.rows[0].user_id;
        [photo_res, signature_res] = await Promise.all([
            await client.query(`INSERT INTO employee_documents (user_id, doc_type, file_url) VALUES ($1, $2, $3) RETURNING *`, [user_id, 'photo', photo]),
            await client.query(`INSERT INTO employee_documents (user_id, doc_type, file_url) VALUES ($1, $2, $3) RETURNING *`, [user_id, 'signature', signature])
        ]);
        await client.query(`UPDATE employee_profiles SET current_step = 7,current_section=1  WHERE user_id = $1`, [user_id]);
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    } finally {
        client.release();
    }
    return [photo_res.rows[0], signature_res.rows[0]] || [];
}

exports.savePersonalInfoStep7 = async ({ user_id, permanent, current }) => {
    // console.log(current, current.length, current)
    if (!permanent || !permanent.address_line || !permanent.post_office || !permanent.city || !permanent.district || !permanent.taluka || !permanent.pin_code || !permanent.mobile || !permanent.std_code || !permanent.phone_number || !permanent.is_govt_residence || !permanent.residing_since) {
        throw { status: 400, message: "All fields are required in Address" };
    }

    if ((current && Object.keys(current).length) && (!current.address_line || !current.post_office || !current.city || !current.district || !current.taluka || !current.pin_code || !current.mobile || !current.std_code || !current.phone_number || !current.is_govt_residence || !current.residing_since)) {
        throw { status: 400, message: "All fields are required in current" };
    }
    let permanent_res;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const stepCheck = await client.query(
            `SELECT user_id, current_step, current_section FROM employee_profiles WHERE user_id = $1`,
            [user_id]
        );

        if (!stepCheck.rows.length || stepCheck.rows[0].current_section < 1) {
            throw { status: 404, message: "Registration Incomplete" };
        }

        permanent_res = await client.query(
            `INSERT INTO employee_addresses
        (user_id, address_type, address_line, post_office, city, district, taluka, pin_code, mobile, std_code, phone_number, is_govt_residence, residing_since)
        
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
        
        ON CONFLICT (user_id, address_type)
        DO UPDATE SET
            address_line = EXCLUDED.address_line,
            post_office = EXCLUDED.post_office,
            city = EXCLUDED.city,
            district = EXCLUDED.district,
            taluka = EXCLUDED.taluka,
            pin_code = EXCLUDED.pin_code,
            mobile = EXCLUDED.mobile,
            std_code = EXCLUDED.std_code,
            phone_number = EXCLUDED.phone_number,
            is_govt_residence = EXCLUDED.is_govt_residence,
            residing_since = EXCLUDED.residing_since
        
        RETURNING *`,
            [
                user_id,
                1,
                permanent.address_line,
                permanent.post_office,
                permanent.city,
                permanent.district,
                permanent.taluka,
                permanent.pin_code,
                permanent.mobile,
                permanent.std_code,
                permanent.phone_number,
                permanent.is_govt_residence,
                permanent.residing_since
            ]
        );
        if (current && Object.keys(current).length) {
            current_res = await client.query(
                `INSERT INTO employee_addresses
        (user_id, address_type, address_line, post_office, city, district, taluka, pin_code, mobile, std_code, phone_number, is_govt_residence, residing_since)
        
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
        
        ON CONFLICT (user_id, address_type)
        DO UPDATE SET
            address_line = EXCLUDED.address_line,
            post_office = EXCLUDED.post_office,
            city = EXCLUDED.city,
            district = EXCLUDED.district,
            taluka = EXCLUDED.taluka,
            pin_code = EXCLUDED.pin_code,
            mobile = EXCLUDED.mobile,
            std_code = EXCLUDED.std_code,
            phone_number = EXCLUDED.phone_number,
            is_govt_residence = EXCLUDED.is_govt_residence,
            residing_since = EXCLUDED.residing_since
        
        RETURNING *`,
                [
                    user_id,
                    2,
                    current.address_line,
                    current.post_office,
                    current.city,
                    current.district,
                    current.taluka,
                    current.pin_code,
                    current.mobile,
                    current.std_code,
                    current.phone_number,
                    current.is_govt_residence,
                    current.residing_since
                ]
            );
        }

        await client.query(
            `UPDATE employee_profiles SET current_step = 8,current_section=1  WHERE user_id = $1`,
            [user_id]
        );
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    }
    finally {
        client.release();
    }
    return (current && Object.keys(current).length) ? [permanent_res.rows[0], current_res.rows[0]] : [permanent_res.rows[0]] || [];
}
exports.savePersonalInfoStep8 = async ({ user_id, contact_name, relation, mobile, alt_contact_name, alt_mobile, std_code, phone_number, home_std_code, home_phone_number, residing_since }) => {
    // console.log(current, current.length, current)
    if (!user_id || !contact_name || !relation || !mobile || !alt_contact_name || !alt_mobile || !std_code || !phone_number || !home_std_code || !home_phone_number || !residing_since) {
        throw { status: 400, message: "All fields are required" };
    }

    let contact_res;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const stepCheck = await client.query(
            `SELECT user_id, current_step, current_section FROM employee_profiles WHERE user_id = $1`,
            [user_id]
        );

        if (!stepCheck.rows.length || stepCheck.rows[0].current_section < 1) {
            throw { status: 404, message: "Registration Incomplete" };
        }

        contact_res = await client.query(
            `
                INSERT INTO employee_emergency_contacts(
                user_id,contact_name,relation,mobile,alt_contact_name,alt_mobile,std_code,phone_number,home_std_code,home_phone_number,residing_since) VALUES 
                ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
                ON CONFLICT (mobile)
                DO UPDATE SET
                contact_name = EXCLUDED.contact_name,
                relation = EXCLUDED.relation,
                alt_contact_name = EXCLUDED.alt_contact_name,
                alt_mobile = EXCLUDED.alt_mobile,
                std_code = EXCLUDED.std_code,
                phone_number=EXCLUDED.phone_number,
                home_std_code=EXCLUDED.home_std_code,
                home_phone_number=EXCLUDED.home_phone_number,
                residing_since=EXCLUDED.residing_since
            RETURNING 
                contact_name, relation, mobile, alt_contact_name, alt_mobile, std_code, phone_number, home_std_code, home_phone_number, residing_since
            `, [user_id, contact_name, relation, mobile, alt_contact_name, alt_mobile, std_code, phone_number, home_std_code, home_phone_number, residing_since]
        );

        await client.query(
            `UPDATE employee_profiles SET current_step = 9,current_section=1  WHERE user_id = $1`,
            [user_id]
        );
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    }
    finally {
        client.release();
    }

    return contact_res.rows[0] || [];
}
exports.savePersonalInfoStep9 = async ({ user_id, salutation, first_name, middle_name, last_name, dob, relation }) => {

    if (!user_id || !salutation || !first_name || !middle_name || !last_name || !dob || !relation) {
        throw { status: 400, message: "All fields are required" };
    }

    let contact_res;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const stepCheck = await client.query(
            `SELECT user_id, current_step, current_section FROM employee_profiles WHERE user_id = $1`,
            [user_id]
        );

        if (!stepCheck.rows.length || stepCheck.rows[0].current_section < 1) {
            throw { status: 404, message: "Registration Incomplete" };
        }

        family_res = await client.query(
            `INSERT INTO employee_family(user_id,salutation,first_name,middle_name,last_name,dob,relation) VALUES($1,$2,$3,$4,$5,$6,$7)
            RETURNING salutation,first_name,middle_name,last_name,dob,relation
            `, [user_id, salutation, first_name, middle_name, last_name, dob, relation]
        );

        await client.query(
            `UPDATE employee_profiles SET current_step = 10,current_section=1  WHERE user_id = $1`,
            [user_id]
        );
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    }
    finally {
        client.release();
    }

    return family_res.rows[0] || [];
}
exports.savePersonalInfoStep10 = async ({ user_id, nomination_type, nominee_name, middle_name, relation_to_employee, nominee_age, share_percentage, contingency_event, alternate_nominee_name, alternate_nominee_relation, alternate_nominee_address }) => {

    if (!user_id || !nomination_type || !nominee_name || !middle_name || !relation_to_employee || !nominee_age || !share_percentage || !contingency_event || !alternate_nominee_name || !alternate_nominee_relation || !alternate_nominee_address) {
        throw { status: 400, message: "All fields are required" };
    }

    let contact_res;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const stepCheck = await client.query(
            `SELECT user_id, current_step, current_section FROM employee_profiles WHERE user_id = $1`,
            [user_id]
        );

        if (!stepCheck.rows.length || stepCheck.rows[0].current_section < 1) {
            throw { status: 404, message: "Registration Incomplete" };
        }

        family_res = await client.query(
            `INSERT INTO employee_nominations(user_id, nomination_type, nominee_name, relation_to_employee, nominee_age, share_percentage, contingency_event, alternate_nominee_name, alternate_nominee_relation, alternate_nominee_address) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
            RETURNING nomination_type, nominee_name, relation_to_employee, nominee_age, share_percentage, contingency_event, alternate_nominee_name, alternate_nominee_relation, alternate_nominee_address
            `, [user_id, nomination_type, nominee_name, relation_to_employee, nominee_age, share_percentage, contingency_event, alternate_nominee_name, alternate_nominee_relation, alternate_nominee_address]
        );

        await client.query(
            `UPDATE employee_profiles SET current_step = 1,current_section=2  WHERE user_id = $1`,
            [user_id]
        );
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    }
    finally {
        client.release();
    }

    return family_res.rows[0] || [];
}

// Education CONTROLLER FUNCTIONS
exports.saveEducationStep1 = async ({ user_id, edu_type, institution, qualification, pass_year, obtained_at, passing_cert }) => {
    // console.log('deva')

    if (!user_id || !edu_type || !institution || !qualification || !pass_year || !obtained_at || !passing_cert) {
        throw { status: 400, message: "All fields are required" };
    }

    // let education_res;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const stepCheck = await client.query(
            `SELECT user_id, current_step, current_section FROM employee_profiles WHERE user_id = $1`,
            [user_id]
        );
        console.log('radd')
        if (!stepCheck.rows.length || stepCheck.rows[0].current_section < 2) {
            throw { status: 404, message: "Registration Incomplete" };
        }

        education_res = await client.query(
            `INSERT INTO employee_education(user_id, edu_type, institution, qualification, pass_year, obtained_at, cert_url) VALUES ($1,$2,$3,$4,$5,$6,$7)
            ON CONFLICT(edu_type) DO UPDATE SET
            institution=EXCLUDED.institution, qualification=EXCLUDED.qualification, pass_year=EXCLUDED.pass_year, obtained_at=EXCLUDED.obtained_at, cert_url=EXCLUDED.obtained_at
            RETURNING edu_id, edu_type, institution, qualification, pass_year, obtained_at, cert_url` , [user_id, edu_type, institution, qualification, pass_year, obtained_at, passing_cert]
        );

        await client.query(
            `UPDATE employee_profiles SET current_step = 2,current_section=2  WHERE user_id = $1`,
            [user_id]
        );
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    }
    finally {
        client.release();
    }

    return education_res.rows[0] || [];
}
exports.saveEducationStep2 = async ({ user_id, course_name, institution, coordinator, start_date, end_date, training_type, training_cert }) => {

    if (!user_id || !course_name || !institution || !coordinator || !start_date || !end_date || !training_type || !training_cert) {
        throw { status: 400, message: "All fields are required" };
    }

    // let education_res;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const stepCheck = await client.query(
            `SELECT user_id, current_step, current_section FROM employee_profiles WHERE user_id = $1`,
            [user_id]
        );
        console.log('radd')
        if (!stepCheck.rows.length || stepCheck.rows[0].current_section < 2) {
            throw { status: 404, message: "Registration Incomplete" };
        }

        training_res = await client.query(
            `INSERT INTO employee_training(user_id, course_name, institution, coordinator, start_date, end_date, training_type, cert_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
            RETURNING training_id, course_name, institution, coordinator, start_date, end_date, training_type, cert_url
            `, [user_id, course_name, institution, coordinator, start_date, end_date, training_type, training_cert]
        );

        await client.query(
            `UPDATE employee_profiles SET current_step = 3,current_section=2  WHERE user_id = $1`,
            [user_id]
        );
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    }
    finally {
        client.release();
    }

    return training_res.rows[0] || [];
}
exports.saveEducationStep3 = async ({ user_id, exam_name, status, pass_date, attempt_number }) => {

    if (!user_id || !exam_name || !status || !pass_date || !attempt_number) {
        throw { status: 400, message: "All fields are required" };
    }

    // let education_res;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const stepCheck = await client.query(
            `SELECT user_id, current_step, current_section FROM employee_profiles WHERE user_id = $1`,
            [user_id]
        );
        console.log('radd')
        if (!stepCheck.rows.length || stepCheck.rows[0].current_section < 2) {
            throw { status: 404, message: "Registration Incomplete" };
        }

        dept_exams_res = await client.query(`
            INSERT INTO employee_dept_exams(user_id, exam_name, status, pass_date, attempt_number) VALUES ($1,$2,$3,$4,$5)
            ON CONFLICT(exam_name) DO UPDATE SET
            status=EXCLUDED.status, pass_date=EXCLUDED.pass_date, attempt_number=EXCLUDED.attempt_number
            RETURNING dept_exam_id, exam_name, status, pass_date, attempt_number
            `, [user_id, exam_name, status, pass_date, attempt_number]);

        await client.query(
            `UPDATE employee_profiles SET current_step = 4,current_section=2  WHERE user_id = $1`,
            [user_id]
        );
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    }
    finally {
        client.release();
    }

    return dept_exams_res.rows[0] || [];
}

exports.saveEducationStep4 = async ({ user_id, exam_name, status, pass_date, attempt_number }) => {

    if (!user_id || !exam_name || !status || !pass_date || !attempt_number) {
        throw { status: 400, message: "All fields are required" };
    }

    // let education_res;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const stepCheck = await client.query(
            `SELECT user_id, current_step, current_section FROM employee_profiles WHERE user_id = $1`,
            [user_id]
        );
        console.log('radd')
        if (!stepCheck.rows.length || stepCheck.rows[0].current_section < 2) {
            throw { status: 404, message: "Registration Incomplete" };
        }

        cp_exams_res = await client.query(`
            INSERT INTO employee_competitive_exams(user_id, exam_name, status, pass_date, attempt_number) VALUES($1, $2, $3, $4, $5)
            RETURNING comp_exam_id, exam_name, status, pass_date, attempt_number
            `, [user_id, exam_name, status, pass_date, attempt_number]);

        await client.query(
            `UPDATE employee_profiles SET current_step = 5,current_section=2  WHERE user_id = $1`,
            [user_id]
        );
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    }
    finally {
        client.release();
    }

    return cp_exams_res.rows[0] || [];
}
exports.saveEducationStep5 = async ({ user_id, computer_passed, computer_exempted, computer_pass_date, computer_exempt_date, computer_institution, computer_cert_no, marathi_typing_passed, marathi_typing_exempted, marathi_typing_wpm, marathi_typing_pass_date, marathi_typing_exempt_date, marathi_typing_institution, marathi_typing_cert_no, english_typing_passed, english_typing_exempted, english_typing_wpm, english_typing_pass_date, english_typing_exempt_date, english_typing_institution, english_typing_cert_no, increment_withheld_typing, recovery_done, marathi_lang_passed, marathi_lang_exempted, marathi_lang_pass_date, marathi_lang_exempt_date, hindi_lang_passed, hindi_lang_exempted, hindi_lang_pass_date, hindi_lang_exempt_date, computer_exam_cert, marathi_typing_cert, english_typing_cert, marathi_exam_cert, hindi_exam_cert }) => {
    // console.log('deva')

    if (!user_id || !computer_passed || !computer_exempted || !computer_pass_date || !computer_exempt_date || !computer_institution || !computer_cert_no || !marathi_typing_passed || !marathi_typing_exempted || !marathi_typing_wpm || !marathi_typing_pass_date || !marathi_typing_exempt_date || !marathi_typing_institution || !marathi_typing_cert_no || !english_typing_passed || !english_typing_exempted || !english_typing_wpm || !english_typing_pass_date || !english_typing_exempt_date || !english_typing_institution || !english_typing_cert_no || !increment_withheld_typing || !recovery_done || !marathi_lang_passed || !marathi_lang_exempted || !marathi_lang_pass_date || !marathi_lang_exempt_date || !hindi_lang_passed || !hindi_lang_exempted || !hindi_lang_pass_date || !hindi_lang_exempt_date || !computer_exam_cert || !marathi_typing_cert || !english_typing_cert || !marathi_exam_cert || !hindi_exam_cert) {
        throw { status: 400, message: "All fields are required" };
    }

    // let education_res;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const stepCheck = await client.query(
            `SELECT user_id, current_step, current_section FROM employee_profiles WHERE user_id = $1`,
            [user_id]
        );

        if (!stepCheck.rows.length || stepCheck.rows[0].current_section < 2) {
            throw { status: 404, message: "Registration Incomplete" };
        }

        education_res = await client.query(
            `INSERT INTO employee_other_exams(user_id, computer_passed, computer_exempted, computer_pass_date, computer_exempt_date, computer_institution, computer_cert_no, marathi_typing_passed, marathi_typing_exempted, marathi_typing_wpm, marathi_typing_pass_date, marathi_typing_exempt_date, marathi_typing_institution, marathi_typing_cert_no, english_typing_passed, english_typing_exempted, english_typing_wpm, english_typing_pass_date, english_typing_exempt_date, english_typing_institution, english_typing_cert_no, increment_withheld_typing, recovery_done, marathi_lang_passed, marathi_lang_exempted, marathi_lang_pass_date, marathi_lang_exempt_date, hindi_lang_passed, hindi_lang_exempted, hindi_lang_pass_date, hindi_lang_exempt_date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31)
            RETURNING other_exam_id, computer_passed, computer_exempted, computer_pass_date, computer_exempt_date, computer_institution, computer_cert_no, marathi_typing_passed, marathi_typing_exempted, marathi_typing_wpm, marathi_typing_pass_date, marathi_typing_exempt_date, marathi_typing_institution, marathi_typing_cert_no, english_typing_passed, english_typing_exempted, english_typing_wpm, english_typing_pass_date, english_typing_exempt_date, english_typing_institution, english_typing_cert_no, increment_withheld_typing, recovery_done, marathi_lang_passed, marathi_lang_exempted, marathi_lang_pass_date, marathi_lang_exempt_date, hindi_lang_passed, hindi_lang_exempted, hindi_lang_pass_date, hindi_lang_exempt_date` , [
            user_id, computer_passed, computer_exempted, computer_pass_date, computer_exempt_date, computer_institution, computer_cert_no, marathi_typing_passed, marathi_typing_exempted, marathi_typing_wpm, marathi_typing_pass_date, marathi_typing_exempt_date, marathi_typing_institution, marathi_typing_cert_no, english_typing_passed, english_typing_exempted, english_typing_wpm, english_typing_pass_date, english_typing_exempt_date, english_typing_institution, english_typing_cert_no, increment_withheld_typing, recovery_done, marathi_lang_passed, marathi_lang_exempted, marathi_lang_pass_date, marathi_lang_exempt_date, hindi_lang_passed, hindi_lang_exempted, hindi_lang_pass_date, hindi_lang_exempt_date
        ]
        );


        await client.query(
            `UPDATE employee_profiles SET current_step = 1,current_section=3  WHERE user_id = $1`,
            [user_id]
        );
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    }
    finally {
        client.release();
    }

    return education_res.rows[0] || [];
}

exports.saveServiceInfoStep1 = async ({ user_id, appointment_route, social_reservation, parallel_reservation, order_number, order_date, is_district_transfer, posting_location_type, panchayat_samiti, dept_level, office_name, post_name, post_group, joining_date, pay_commission, pay_scale, grade_pay, basic_pay, appointment_category, medical_done, medical_date, assets_submitted, assets_submitted_date, appointment_order_cert }) => {

    if (!user_id || !appointment_route || !social_reservation || !parallel_reservation || !order_number || !order_date || !is_district_transfer || !posting_location_type || !dept_level || !office_name || !post_name || !post_group || !joining_date || !pay_commission || !pay_scale || !grade_pay || !basic_pay || !appointment_category || !medical_done || !medical_date || !assets_submitted || !assets_submitted_date || !appointment_order_cert) {
        throw { status: 400, message: "All fields are required" };
    }

    let appointment_res;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const stepCheck = await client.query(
            `SELECT user_id, current_step, current_section FROM employee_profiles WHERE user_id = $1`,
            [user_id]
        );

        if (!stepCheck.rows.length || stepCheck.rows[0].current_section < 3) {
            throw { status: 404, message: "Registration Incomplete" };
        }

        appointment_res = await client.query(
            `INSERT INTO employee_appointment(user_id, appointment_route, social_reservation, parallel_reservation, order_number, order_date, is_district_transfer, posting_location_type, panchayat_samiti, dept_level, office_name, post_name, post_group, joining_date, pay_commission, pay_scale, grade_pay, basic_pay, appointment_category, medical_done, medical_date, assets_submitted, assets_submitted_date, appointment_order_cert) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24)
            RETURNING *` , [
            user_id, appointment_route, social_reservation, parallel_reservation, order_number, order_date, is_district_transfer, posting_location_type, panchayat_samiti, dept_level, office_name, post_name, post_group, joining_date, pay_commission, pay_scale, grade_pay, basic_pay, appointment_category, medical_done, medical_date, assets_submitted, assets_submitted_date, appointment_order_cert
        ]
        );


        await client.query(
            `UPDATE employee_profiles SET current_step = 2,current_section=3  WHERE user_id = $1`,
            [user_id]
        );
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    }
    finally {
        client.release();
    }

    return appointment_res.rows[0] || [];
}

exports.saveServiceInfoStep2 = async ({ user_id, employment_type, status_date, probation_applicable, probation_start_date, probation_end_date, probation_completed, probation_order_date, probation_order_number, has_permanency_cert, permanency_cert_date, permanent_from_date, permanent_post_name, probation_cert, permanent_benefit_cert }) => {
    console.log({ user_id, employment_type, status_date, probation_applicable, probation_start_date, probation_end_date, probation_completed, probation_order_date, probation_order_number, has_permanency_cert, permanency_cert_date, permanent_from_date, permanent_post_name, probation_cert, permanent_benefit_cert })
    if (!user_id || !employment_type || !status_date || !probation_applicable || !probation_start_date || !probation_end_date || !probation_completed || !probation_order_date || !probation_order_number || !has_permanency_cert || !permanency_cert_date || !permanent_from_date || !permanent_post_name || !probation_cert || !permanent_benefit_cert) {
        throw { status: 400, message: "All fields are required" };
    }

    let probation_res;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const stepCheck = await client.query(
            `SELECT user_id, current_step, current_section FROM employee_profiles WHERE user_id = $1`,
            [user_id]
        );

        if (!stepCheck.rows.length || stepCheck.rows[0].current_section < 3) {
            throw { status: 404, message: "Registration Incomplete" };
        }

        probation_res = await client.query(
            `INSERT INTO employee_service_status(
            user_id, employment_type, status_date, probation_applicable, probation_start_date, probation_end_date, probation_completed, probation_order_date, probation_order_number, has_permanency_cert, permanency_cert_date, permanent_from_date, permanent_post_name, probation_cert, permanent_benefit_cert)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
            RETURNING *` , [
            user_id, employment_type, status_date, probation_applicable, probation_start_date, probation_end_date, probation_completed, probation_order_date, probation_order_number, has_permanency_cert, permanency_cert_date, permanent_from_date, permanent_post_name, probation_cert, permanent_benefit_cert
        ]);


        await client.query(
            `UPDATE employee_profiles SET current_step = 3,current_section=3  WHERE user_id = $1`,
            [user_id]
        );
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    }
    finally {
        client.release();
    }

    return probation_res.rows[0] || [];
}
exports.saveServiceInfoStep3 = async ({
    user_id,
    services,
    chattopadhyay_granted,
    chattopadhyay_order_no,
    chattopadhyay_order_date,
    nivadshreeni_order_no,
    nivadshreeni_order_date,
    year,
    submitted,
    submitted_date,
    asset_liability_cert
}) => {

    if (!user_id || !chattopadhyay_granted || !chattopadhyay_order_no || !chattopadhyay_order_date ||
        !nivadshreeni_order_no || !nivadshreeni_order_date || !year || !submitted || !submitted_date || !asset_liability_cert) {
        throw { status: 400, message: "All fields are required" };
    }

    if (!services || services.length < 1) {
        throw { status: 400, message: "Services are required" };
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const stepCheck = await client.query(
            `SELECT user_id, current_step, current_section FROM employee_profiles WHERE user_id = $1`,
            [user_id]
        );

        if (!stepCheck.rows.length || stepCheck.rows[0].current_section < 3) {
            throw { status: 404, message: "Registration Incomplete" };
        }

        const insertedACP = [];
        const test = JSON.parse(services);

        for (const ele of test) {
            console.log("SART", ele)
            const res = await client.query(
                `INSERT INTO employee_acp_benefits(
                    user_id, years_required, benefit_no, service_completion_date,
                    benefit_received, benefit_date, due_date, order_number, order_date
                )
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
                ON CONFLICT (user_id, benefit_no) DO UPDATE SET
                    years_required = EXCLUDED.years_required,
                    service_completion_date = EXCLUDED.service_completion_date,
                    benefit_received = EXCLUDED.benefit_received,
                    benefit_date = EXCLUDED.benefit_date,
                    due_date = EXCLUDED.due_date,
                    order_number = EXCLUDED.order_number,
                    order_date = EXCLUDED.order_date
                RETURNING *`,
                [
                    user_id,
                    ele.years_required,
                    ele.benefit_no,
                    ele.service_completion_date,
                    ele.benefit_received,
                    ele.benefit_date,
                    ele.due_date,
                    ele.order_number,
                    ele.order_date
                ]
            );

            insertedACP.push(res.rows[0]);
        }


        const acp_id = insertedACP[0].acp_id;

        await client.query(
            `UPDATE employee_acp_benefits
             SET chattopadhyay_granted=$1,
                 chattopadhyay_order_no=$2,
                 chattopadhyay_order_date=$3
             WHERE acp_id=$4`,
            [chattopadhyay_granted, chattopadhyay_order_no, chattopadhyay_order_date, acp_id]
        );


        const assetRes = await client.query(
            `INSERT INTO employee_asset_liability(
                user_id, year, submitted, submitted_date, created_at, asset_liability_cert
            )
            VALUES($1,$2,$3,$4,NOW(),$5)
            RETURNING *`,
            [user_id, year, submitted, submitted_date, asset_liability_cert]
        );

        await client.query(
            `UPDATE employee_profiles
             SET current_step = 1, current_section = 4
             WHERE user_id = $1`,
            [user_id]
        );

        await client.query('COMMIT');

        return {
            acp: insertedACP,
            asset: assetRes.rows[0]
        };

    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    } finally {
        client.release();
    }
};

exports.savePaymentInfoStep1 = async ({
    user_id, pay_commission, band_pay_level, grade_pay_matrix, pay_in_band, commission_date, effective_date, current_basic_pay
}) => {

    if (!user_id || !pay_commission || !band_pay_level || !grade_pay_matrix || !pay_in_band || !commission_date || !effective_date || !current_basic_pay) {
        throw { status: 400, message: "All fields are required" };
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const stepCheck = await client.query(
            `SELECT user_id, current_step, current_section FROM employee_profiles WHERE user_id = $1`,
            [user_id]
        );

        if (!stepCheck.rows.length || stepCheck.rows[0].current_section < 4) {
            throw { status: 404, message: "Registration Incomplete" };
        }

        // const insertedACP = [];
        // const test = JSON.parse(services);

        const assetRes = await client.query(
            `INSERT INTO employee_pay_commission(
user_id, pay_commission, band_pay_level, grade_pay_matrix, pay_in_band, commission_date, effective_date, current_basic_pay)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
                RETURNING *`,
            [user_id, pay_commission, band_pay_level, grade_pay_matrix, pay_in_band, commission_date, effective_date, current_basic_pay]
        );

        await client.query(
            `UPDATE employee_profiles
             SET current_step = 2, current_section = 4
             WHERE user_id = $1`,
            [user_id]
        );

        await client.query('COMMIT');

        return assetRes.rows[0] || []

    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    } finally {
        client.release();
    }
};
exports.savePaymentInfoStep2 = async ({
    user_id, allowance_type, effective_from, effective_to, amount
}) => {

    if (!user_id || !allowance_type || !effective_from || !effective_to || !amount) {
        throw { status: 400, message: "All fields are required" };
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const stepCheck = await client.query(
            `SELECT user_id, current_step, current_section FROM employee_profiles WHERE user_id = $1`,
            [user_id]
        );

        if (!stepCheck.rows.length || stepCheck.rows[0].current_section < 4) {
            throw { status: 404, message: "Registration Incomplete" };
        }


        const assetRes = await client.query(
            `INSERT INTO employee_allowances(user_id, allowance_type, effective_from, effective_to, amount)
                VALUES ($1,$2,$3,$4,$5)
                RETURNING *`,
            [user_id, allowance_type, effective_from, effective_to, amount]
        );

        await client.query(
            `UPDATE employee_profiles
             SET current_step = 3, current_section = 4
             WHERE user_id = $1`,
            [user_id]
        );

        await client.query('COMMIT');

        return assetRes.rows[0] || []

    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    } finally {
        client.release();
    }
};
exports.savePaymentInfoStep3 = async ({
    user_id, is_applicable, scheme_type, approved_date, revised_pay, effective_date
}) => {

    if (!user_id || !is_applicable || !scheme_type || !approved_date || !revised_pay || !effective_date) {
        throw { status: 400, message: "All fields are required" };
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const stepCheck = await client.query(
            `SELECT user_id, current_step, current_section FROM employee_profiles WHERE user_id = $1`,
            [user_id]
        );

        if (!stepCheck.rows.length || stepCheck.rows[0].current_section < 4) {
            throw { status: 404, message: "Registration Incomplete" };
        }


        const assetRes = await client.query(
            `INSERT INTO employee_pay_schemes(user_id, is_applicable, scheme_type, approved_date, revised_pay, effective_date) 
                VALUES ($1,$2,$3,$4,$5,$6)
                RETURNING *`,
            [user_id, is_applicable, scheme_type, approved_date, revised_pay, effective_date]
        );

        await client.query(
            `UPDATE employee_profiles
             SET current_step = 4, current_section = 4
             WHERE user_id = $1`,
            [user_id]
        );

        await client.query('COMMIT');

        return assetRes.rows[0] || []

    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    } finally {
        client.release();
    }
};
exports.savePaymentInfoStep4 = async ({
    user_id, recovery_done, from_date, to_date, amount, reason, cert_number, cert_date
}) => {

    if (!user_id || !recovery_done || !from_date || !to_date || !amount || !reason || !cert_number || !cert_date) {
        throw { status: 400, message: "All fields are required" };
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const stepCheck = await client.query(
            `SELECT user_id, current_step, current_section FROM employee_profiles WHERE user_id = $1`,
            [user_id]
        );

        if (!stepCheck.rows.length || stepCheck.rows[0].current_section < 4) {
            throw { status: 404, message: "Registration Incomplete" };
        }


        const assetRes = await client.query(
            `INSERT INTO employee_overpayment(user_id, recovery_done, from_date, to_date, amount, reason, cert_number, cert_date)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
                RETURNING *`,
            [user_id, recovery_done, from_date, to_date, amount, reason, cert_number, cert_date]
        );

        await client.query(
            `UPDATE employee_profiles
             SET current_step = 1, current_section = 5
             WHERE user_id = $1`,
            [user_id]
        );

        await client.query('COMMIT');

        return assetRes.rows[0] || []

    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    } finally {
        client.release();
    }
};

exports.saveTransferInfostep1 = async ({
    user_id, transfer_type, transfer_category, order_date, is_current_posting, is_district_transfer, posting_location_type, panchayat_samiti, dept_level, office_name, post_name, is_gazetted, joining_date, end_date
}) => {
    console.log(44444, {
        user_id, transfer_type, transfer_category, order_date, is_current_posting, is_district_transfer, posting_location_type, panchayat_samiti, dept_level, office_name, post_name, is_gazetted, joining_date, end_date
    })
    if (!user_id || !transfer_type || !transfer_category || !order_date || !is_current_posting || !is_district_transfer || !posting_location_type || !panchayat_samiti || !dept_level || !office_name || !post_name || !is_gazetted || !joining_date || !end_date) {
        throw { status: 400, message: "All fields are required" };
    }


    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const stepCheck = await client.query(
            `SELECT user_id, current_step, current_section FROM employee_profiles WHERE user_id = $1`,
            [user_id]
        );

        if (!stepCheck.rows.length || stepCheck.rows[0].current_section < 5) {
            throw { status: 404, message: "Registration Incomplete" };
        }

        const result = await client.query(
            `INSERT INTO employee_transfers(
                user_id, transfer_type, transfer_category, order_date, is_current_posting, is_district_transfer, posting_location_type, panchayat_samiti, dept_level, office_name, post_name, is_gazetted, joining_date, end_date
            )
            VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
            RETURNING *`,
            [user_id, transfer_type, transfer_category, order_date, is_current_posting, is_district_transfer, posting_location_type, panchayat_samiti, dept_level, office_name, post_name, is_gazetted, joining_date, end_date]
        );

        await client.query(
            `UPDATE employee_profiles
             SET current_step = 1, current_section = 6
             WHERE user_id = $1`,
            [user_id]
        );

        await client.query('COMMIT');

        return result.rows[0];

    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    } finally {
        client.release();
    }
};

exports.savePromotionInfostep1 = async ({
    user_id, promotion_type, promotion_category, order_date, is_current_posting, is_district_transfer, posting_location_type, panchayat_samiti, dept_level, office_name, post_name, is_gazetted, joining_date, end_date
}) => {

    if (!user_id || !promotion_type || !promotion_category || !order_date || !is_current_posting || !is_district_transfer || !posting_location_type || !panchayat_samiti || !dept_level || !office_name || !post_name || !is_gazetted || !joining_date || !end_date) {
        throw { status: 400, message: "All fields are required" };
    }


    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const stepCheck = await client.query(
            `SELECT user_id, current_step, current_section FROM employee_profiles WHERE user_id = $1`,
            [user_id]
        );

        if (!stepCheck.rows.length || stepCheck.rows[0].current_section < 6) {
            throw { status: 404, message: "Registration Incomplete" };
        }

        const result = await client.query(
            `INSERT INTO employee_promotions(
            user_id, promotion_type, promotion_category, order_date, is_current_posting, is_district_transfer, posting_location_type, panchayat_samiti, dept_level, office_name, post_name, is_gazetted, joining_date, end_date)
            VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
            RETURNING *`,
            [user_id, promotion_type, promotion_category, order_date, is_current_posting, is_district_transfer, posting_location_type, panchayat_samiti, dept_level, office_name, post_name, is_gazetted, joining_date, end_date]
        );

        await client.query(
            `UPDATE employee_profiles
             SET current_step = 1, current_section = 7
             WHERE user_id = $1`,
            [user_id]
        );

        await client.query('COMMIT');

        return result.rows[0];

    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    } finally {
        client.release();
    }
};

exports.saveServiceExtensionInfostep1 = async ({
    user_id, extension_granted, extension_order_no, extension_order_date, increment_withheld, withheld_from, withheld_to, withheld_order_date, withheld_order_no, withheld_order_cert
}) => {

    if (!user_id || !extension_granted || !extension_order_no || !extension_order_date || !increment_withheld || !withheld_from || !withheld_to || !withheld_order_date || !withheld_order_no || !withheld_order_cert) {
        throw { status: 400, message: "All fields are required" };
    }


    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const stepCheck = await client.query(
            `SELECT user_id, current_step, current_section FROM employee_profiles WHERE user_id = $1`,
            [user_id]
        );

        if (!stepCheck.rows.length || stepCheck.rows[0].current_section < 7) {
            throw { status: 404, message: "Registration Incomplete" };
        }

        const result = await client.query(
            `INSERT INTO employee_service_extensions(
user_id, extension_granted, extension_order_no, extension_order_date, increment_withheld, withheld_from, withheld_to, withheld_order_date, withheld_order_no, withheld_order_cert)
            VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
            RETURNING *`,
            [user_id, extension_granted, extension_order_no, extension_order_date, increment_withheld, withheld_from, withheld_to, withheld_order_date, withheld_order_no, withheld_order_cert]
        );

        await client.query(
            `UPDATE employee_profiles
             SET current_step = 1, current_section = 8
             WHERE user_id = $1`,
            [user_id]
        );

        await client.query('COMMIT');

        return result.rows[0];

    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    } finally {
        client.release();
    }
};

exports.saveDisabilityInfostep1 = async ({
    user_id, is_disabled, examiner_name, has_udid, udid_number, disability_type, disability_percentage, exam_date, is_permanent, temp_from, temp_to, transport_allowance, profession_tax_exempt, equipment_provided, equipment_name, cert_date, disability_cert
}) => {

    if (!user_id || !is_disabled || !examiner_name || !has_udid || !udid_number || !disability_type || !disability_percentage || !exam_date || !is_permanent || !temp_from || !temp_to || !transport_allowance || !profession_tax_exempt || !equipment_provided || !equipment_name || !cert_date || !disability_cert) {
        throw { status: 400, message: "All fields are required" };
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const stepCheck = await client.query(
            `SELECT user_id, current_step, current_section FROM employee_profiles WHERE user_id = $1`,
            [user_id]
        );

        if (!stepCheck.rows.length || stepCheck.rows[0].current_section < 8) {
            throw { status: 404, message: "Registration Incomplete" };
        }

        const result = await client.query(
            `INSERT INTO employee_disability(
user_id, is_disabled, examiner_name, has_udid, udid_number, disability_type, disability_percentage, exam_date, is_permanent, temp_from, temp_to, transport_allowance, profession_tax_exempt, equipment_provided, equipment_name, cert_date, disability_cert)
            VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
            RETURNING *`,
            [user_id, is_disabled, examiner_name, has_udid, udid_number, disability_type, disability_percentage, exam_date, is_permanent, temp_from, temp_to, transport_allowance, profession_tax_exempt, equipment_provided, equipment_name, cert_date, disability_cert]
        );

        await client.query(
            `UPDATE employee_profiles
             SET current_step = 1, current_section = 9
             WHERE user_id = $1`,
            [user_id]
        );

        await client.query('COMMIT');

        return result.rows[0];

    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    } finally {
        client.release();
    }
};

exports.saveGroupInsurance1 = async ({
    user_id, year, entry_date, amount, group_insurance_cert
}) => {
    console.log(user_id, year, entry_date, amount, group_insurance_cert);
    if (!user_id || !year || !entry_date || !amount || !group_insurance_cert) {
        throw { status: 400, message: "All fields are required" };
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const stepCheck = await client.query(
            `SELECT user_id, current_step, current_section FROM employee_profiles WHERE user_id = $1`,
            [user_id]
        );

        if (!stepCheck.rows.length || stepCheck.rows[0].current_section < 9) {
            throw { status: 404, message: "Registration Incomplete" };
        }

        const result = await client.query(
            `INSERT INTO employee_group_insurance(user_id, year, entry_date, amount, group_insurance_cert)
            VALUES($1,$2,$3,$4,$5)
            RETURNING *`,
            [user_id, year, entry_date, amount, group_insurance_cert]
        );

        await client.query(
            `UPDATE employee_profiles
             SET current_step = 1, current_section = 10
             WHERE user_id = $1`,
            [user_id]
        );

        await client.query('COMMIT');

        return result.rows[0];

    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    } finally {
        client.release();
    }
};

exports.saveDiscussionInfo1 = async ({
    user_id, from_date, to_date, action_taken, absence_cert
}) => {
    // console.log(user_id, year, entry_date, amount, group_insurance_cert);
    if (!user_id || !from_date || !to_date || !action_taken || !absence_cert) {
        throw { status: 400, message: "All fields are required" };
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const stepCheck = await client.query(
            `SELECT user_id, current_step, current_section FROM employee_profiles WHERE user_id = $1`,
            [user_id]
        );

        if (!stepCheck.rows.length || stepCheck.rows[0].current_section < 10) {
            throw { status: 404, message: "Registration Incomplete" };
        }

        const unauth = await client.query(
            `INSERT INTO employee_unauthorized_absence(user_id, from_date, to_date, action_taken, absence_cert)
            VALUES($1,$2,$3,$4,$5)
            RETURNING *`,
            [user_id, from_date, to_date, action_taken, absence_cert]
        );

        await client.query(
            `UPDATE employee_profiles
             SET current_step = 2, current_section = 10
             WHERE user_id = $1`,
            [user_id]
        );

        await client.query('COMMIT');

        return unauth.rows[0];

    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    } finally {
        client.release();
    }
};

exports.saveDiscussionInfo2 = async ({
    user_id, inquiry_active, inquiry_from, final_decision, decision_details, disciplinary_start_date, inquiry_officer_date, penalty_order_number, penalty_type, penalty_order_date, penalty_order_cert
}) => {

    if (!user_id || !inquiry_active || !inquiry_from || !final_decision || !decision_details || !disciplinary_start_date || !inquiry_officer_date || !penalty_order_number || !penalty_type || !penalty_order_date || !penalty_order_cert) {
        throw { status: 400, message: "All fields are required" };
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const stepCheck = await client.query(
            `SELECT user_id, current_step, current_section FROM employee_profiles WHERE user_id = $1`,
            [user_id]
        );

        if (!stepCheck.rows.length || stepCheck.rows[0].current_section < 10) {
            throw { status: 404, message: "Registration Incomplete" };
        }

        const unauth = await client.query(
            `INSERT INTO employee_dept_inquiry(
user_id, inquiry_active, inquiry_from, final_decision, decision_details, disciplinary_start_date, inquiry_officer_date, penalty_order_number, penalty_type, penalty_order_date, penalty_order_cert)
            VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
            RETURNING *`,
            [user_id, inquiry_active, inquiry_from, final_decision, decision_details, disciplinary_start_date, inquiry_officer_date, penalty_order_number, penalty_type, penalty_order_date, penalty_order_cert]
        );

        await client.query(
            `UPDATE employee_profiles
             SET current_step = 3, current_section = 10
             WHERE user_id = $1`,
            [user_id]
        );

        await client.query('COMMIT');

        return unauth.rows[0];

    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    } finally {
        client.release();
    }
};

exports.saveDiscussionInfo3 = async ({
    user_id, was_suspended, suspension_date, suspension_duration, suspension_reason, criminal_case_filed, subsistence_allowance_pct, disciplinary_action_date, inquiry_officer_date, reinstatement_order_date, reinstatement_joining_date, suspension_period_decision, order_number, order_date, order_cert
}) => {

    if (!user_id || !was_suspended || !suspension_date || !suspension_duration || !suspension_reason || !criminal_case_filed || !subsistence_allowance_pct || !disciplinary_action_date || !inquiry_officer_date || !reinstatement_order_date || !reinstatement_joining_date || !suspension_period_decision || !order_number || !order_date || !order_cert) {
        throw { status: 400, message: "All fields are required" };
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const stepCheck = await client.query(
            `SELECT user_id, current_step, current_section FROM employee_profiles WHERE user_id = $1`,
            [user_id]
        );

        if (!stepCheck.rows.length || stepCheck.rows[0].current_section < 10) {
            throw { status: 404, message: "Registration Incomplete" };
        }

        const result = await client.query(
            `INSERT INTO employee_suspension(
user_id, was_suspended, suspension_date, suspension_duration, suspension_reason, criminal_case_filed, subsistence_allowance_pct, disciplinary_action_date, inquiry_officer_date, reinstatement_order_date, reinstatement_joining_date, suspension_period_decision, order_number, order_date, order_cert)
            VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
            RETURNING *`,
            [user_id, was_suspended, suspension_date, suspension_duration, suspension_reason, criminal_case_filed, subsistence_allowance_pct, disciplinary_action_date, inquiry_officer_date, reinstatement_order_date, reinstatement_joining_date, suspension_period_decision, order_number, order_date, order_cert]
        );

        await client.query(
            `UPDATE employee_profiles
             SET current_step = 4, current_section = 10
             WHERE user_id = $1`,
            [user_id]
        );

        await client.query('COMMIT');

        return result.rows[0];

    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    } finally {
        client.release();
    }
};
exports.saveDiscussionInfo4 = async ({
    user_id, case_active, court_name, order_number, order_date, order_cert
}) => {
    // console.log(user_id, year, entry_date, amount, group_insurance_cert);
    if (!user_id || !case_active || !court_name || !order_number || !order_date || !order_cert) {
        throw { status: 400, message: "All fields are required" };
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const stepCheck = await client.query(
            `SELECT user_id, current_step, current_section FROM employee_profiles WHERE user_id = $1`,
            [user_id]
        );

        if (!stepCheck.rows.length || stepCheck.rows[0].current_section < 10) {
            throw { status: 404, message: "Registration Incomplete" };
        }

        const result = await client.query(
            `INSERT INTO employee_court_cases(user_id, case_active, court_name, order_number, order_date, order_cert)
            VALUES($1,$2,$3,$4,$5,$6)
            RETURNING *`,
            [user_id, case_active, court_name, order_number, order_date, order_cert]
        );

        await client.query(
            `UPDATE employee_profiles
             SET current_step = 1, current_section = 11
             WHERE user_id = $1`,
            [user_id]
        );

        await client.query('COMMIT');

        return result.rows[0];

    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    } finally {
        client.release();
    }
};

// remaining
exports.saveAdvancesInfo1 = async ({
    user_id, advance_type, advance_details, amount, fully_repaid, repaid_cert_no, repaid_cert_date
}) => {
    // console.log(user_id, year, entry_date, amount, group_insurance_cert);
    if (!user_id || !advance_type || !advance_details || !amount || !fully_repaid || !repaid_cert_no || !repaid_cert_date) {
        throw { status: 400, message: "All fields are required" };
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const stepCheck = await client.query(
            `SELECT user_id, current_step, current_section FROM employee_profiles WHERE user_id = $1`,
            [user_id]
        );

        if (!stepCheck.rows.length || stepCheck.rows[0].current_section < 11) {
            throw { status: 404, message: "Registration Incomplete" };
        }

        const result = await client.query(
            `INSERT INTO employee_advances(
user_id, advance_type, advance_details, amount, fully_repaid, repaid_cert_no,repaid_cert_date)
            VALUES($1,$2,$3,$4,$5,$6,$7)
            RETURNING *`,
            [user_id, advance_type, advance_details, amount, fully_repaid, repaid_cert_no, repaid_cert_date]
        );

        await client.query(
            `UPDATE employee_profiles
             SET current_step = 1, current_section = 12
             WHERE user_id = $1`,
            [user_id]
        );

        await client.query('COMMIT');

        return result.rows[0];

    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    } finally {
        client.release();
    }
};

exports.saveMedicalCondition1 = async ({
    user_id, has_brain_thalassemia_child, has_chromosomal_disorder_child, has_paralysis, has_mentally_disabled_child, has_kidney_dialysis, has_cancer, is_veteran_spouse_widow, is_abandoned_divorced_woman, other_conditions
}) => {
    if (!user_id || !has_brain_thalassemia_child || !has_chromosomal_disorder_child || !has_paralysis || !has_mentally_disabled_child || !has_kidney_dialysis || !has_cancer || !is_veteran_spouse_widow || !is_abandoned_divorced_woman || !other_conditions) {
        throw { status: 400, message: "All fields are required" };
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const stepCheck = await client.query(
            `SELECT user_id, current_step, current_section FROM employee_profiles WHERE user_id = $1`,
            [user_id]
        );

        if (!stepCheck.rows.length || stepCheck.rows[0].current_section < 12) {
            throw { status: 404, message: "Registration Incomplete" };
        }

        const result = await client.query(
            `INSERT INTO employee_special_conditions(
user_id, has_brain_thalassemia_child, has_chromosomal_disorder_child, has_paralysis, has_mentally_disabled_child, has_kidney_dialysis, has_cancer, is_veteran_spouse_widow, is_abandoned_divorced_woman, other_conditions)
            VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
            RETURNING *`,
            [user_id, has_brain_thalassemia_child, has_chromosomal_disorder_child, has_paralysis, has_mentally_disabled_child, has_kidney_dialysis, has_cancer, is_veteran_spouse_widow, is_abandoned_divorced_woman, other_conditions]
        );

        await client.query(
            `UPDATE employee_profiles
             SET current_step = 1, current_section = 13
             WHERE user_id = $1`,
            [user_id]
        );

        await client.query('COMMIT');

        return result.rows[0];

    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    } finally {
        client.release();
    }
};

exports.saveServiceBook1 = async ({
    user_id, duplicate_received, is_updated, verification_type, service_book_cert, verification_date, verification_cert
}) => {
    if (!user_id || !duplicate_received || !is_updated || !verification_type || !service_book_cert || !verification_date || !verification_cert) {
        throw { status: 400, message: "All fields are required" };
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const stepCheck = await client.query(
            `SELECT user_id, current_step, current_section FROM employee_profiles WHERE user_id = $1`,
            [user_id]
        );

        if (!stepCheck.rows.length || stepCheck.rows[0].current_section < 13) {
            throw { status: 404, message: "Registration Incomplete" };
        }

        const result = await client.query(
            `INSERT INTO employee_service_book(user_id, duplicate_received, is_updated, service_book_cert)
            VALUES($1,$2,$3,$4)
            RETURNING *`,
            [user_id, duplicate_received, is_updated, service_book_cert]
        );
        const result2 = await client.query(
            `INSERT INTO employee_service_book_verification(user_id, verification_type, verification_date, verification_cert)
            VALUES($1,$2,$3,$4)
            RETURNING *`,
            [user_id, verification_type, verification_date, verification_cert]
        );
        await client.query(
            `UPDATE employee_profiles
             SET current_step = 1, current_section = 14
             WHERE user_id = $1`,
            [user_id]
        );

        await client.query('COMMIT');

        return [result.rows[0], result2.rows[0]];

    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    } finally {
        client.release();
    }
};

exports.saveCertificateInfo1 = async ({
    user_id, character_antecedents, constitution_oath, home_village_decl, medical_cert, small_family_pledge, undertaking, medical_reimbursement_option, nps_family_pension_option }) => {

    if (!user_id || !character_antecedents || !constitution_oath || !home_village_decl || !medical_cert || !small_family_pledge || !undertaking || !medical_reimbursement_option || !nps_family_pension_option) {
        throw { status: 400, message: "All fields are required" };
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const stepCheck = await client.query(
            `SELECT user_id, current_step, current_section FROM employee_profiles WHERE user_id = $1`,
            [user_id]
        );

        if (!stepCheck.rows.length || stepCheck.rows[0].current_section < 14) {
            throw { status: 404, message: "Registration Incomplete" };
        }

        const result = await client.query(
            `INSERT INTO employee_appointment_certs(
user_id, character_antecedents, constitution_oath, home_village_decl, medical_cert, small_family_pledge, undertaking, medical_reimbursement_option, nps_family_pension_option)
            VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
            RETURNING *`,
            [user_id, character_antecedents, constitution_oath, home_village_decl, medical_cert, small_family_pledge, undertaking, medical_reimbursement_option, nps_family_pension_option]
        );

        await client.query('COMMIT');

        return result.rows[0];

    } catch (error) {
        await client.query('ROLLBACK');
        throw { status: 500, message: error.message || "Internal Server Error" };
    } finally {
        client.release();
    }
};


exports.getCurrentStep = async ({ aadhar_number }) => {
    if (!aadhar_number) {
        throw { status: 400, message: "aadhar_number must be provided" };
    }
    // console.log(aadhar_number)
    const result = await pool.query(
        `SELECT u.user_id, ep.first_name, ep.last_name, u.phone, ep.department_id,u.zp_id, u.role_id, em.name current_section,ep.current_step, ep.aadhar_number from users u
        JOIN employee_profiles ep on u.user_id = ep.user_id
        JOIN enum_master em ON ep.current_section=em.enum_id AND em.master_name='employee_sections'
        WHERE ep.aadhar_number = $1`,
        [aadhar_number]
    );
    return result.rows[0] || [];
}

exports.getAppraisalInfo = async ({ user_id }) => {
    if (!user_id) {
        throw { status: 400, message: "user_id must be provided" };
    }
    const result = await pool.query(
        `SELECT ep.first_name, ep.last_name, ep.dob,ep.cadre_service_name, ep.current_office_joining_date, dept.name FROM employee_profiles ep
            JOIN departments dept ON ep.department_id = dept.department_id
            WHERE user_id = $1`,
        [user_id]
    );
    return result.rows || [];
};