const pool = require('../../config/database');
const { logAudit } = require("../../config/logAudit");

 exports.createZp = async (name, district_id) => {
    const result = await pool.query(
        'INSERT INTO zp (name, district_id) VALUES ($1, $2) RETURNING *',
        [name, district_id]
    );
    return result.rows[0];
};

exports.getZps = async () => {
    const result = await pool.query(`
        SELECT z.*, d.name as district_name 
        FROM zp z
        LEFT JOIN districts d ON z.district_id = d.district_id
        ORDER BY z.zp_id ASC
    `);
    return result.rows;
};

exports.getZpById = async (id) => {
    const result = await pool.query('SELECT * FROM zp WHERE zp_id = $1', [id]);
    return result.rows[0];
};

exports.updateZp = async (id, name, district_id, status) => {
    const result = await pool.query(
        'UPDATE zp SET name = $1, district_id = $2, status = $3, updated_at = NOW() WHERE zp_id = $4 RETURNING *',
        [name, district_id, status, id]
    );
    return result.rows[0];
};

exports.deleteZp = async (id) => {
    await pool.query('DELETE FROM zp WHERE zp_id = $1', [id]);
};

// add cadre zp wise 
exports.addCadre = async (department_id, description, cadre_name, zp_id) => {
    try {
        const result = await pool.query(
            `INSERT INTO cadre (department_id, description, cadre_name, zp_id) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [department_id, description, cadre_name, zp_id]
        );

        return result.rows[0];
    } catch (error) {
        console.error("Error in addCadre service:", error);
        throw error;
    }
};
// add department zp wise 
exports.addDepartment = async(name,zp_id)=>{
    try{
const result = await pool.query(
    `INSERT INTO departments (name, zp_id) VALUES ($1, $2) RETURNING *`,
    [name,zp_id]
);
return result.rows[0];
    }catch(error){
        console.error("Error in addDepartment service:", error);
        throw error;
    }
}
// get department by zp wise
exports.getDepartmentByZP = async (zp_id) => {
    try {
        console.log("service Hit for getDepartmentByZP with zp_id:", zp_id);
        const result = await pool.query(`SELECT name FROM departments WHERE zp_id = $1 AND status = 1`, [zp_id]);
        return result.rows;
    } catch (error) {
        console.error("Error in getDepartmentByZP service:", error);
        throw error;
    }
};
// get department by id
exports.getDepartmentById = async(department_id)=>{
    try {  
        const result = await pool.query(`SELECT name FROM 
            departments WHERE department_id = $1 AND status = 1`, [department_id]);
        return result.rows[0];
} catch (error) {
    console.error("Error in getDepartmentById service:", error);
    throw error;
}
}
// update department
exports.updateDepartment = async(department_id,name)=>{
    try{
        const result = await pool.query(`UPDATE departments SET name = $2 WHERE department_id = $1 AND status = 1 RETURNING *`,[department_id,name]);
        return result.rows[0];
    }catch(error){
        console.error("Error in updateDepartment service:", error);
        throw error;
    }
}
// delete department 
exports.deleteDepartment = async(department_id)=>{
    try{
        const result = await pool.query(`UPDATE departments SET 
            status = 0 WHERE department_id = $1`,[department_id]);
        return result.rows[0];
    }catch(error){
        console.error("Error in deleteDepartment service:", error);
        throw error;

    }
}
// get cadre zp wise
exports.getCadre = async (zp_id) => {
    try {
        const result = await pool.query(
            `SELECT c.cadre_id, c.department_id, c.description, c.cadre_name, d.name 
             FROM cadre c
             JOIN departments d ON c.department_id = d.department_id
             WHERE c.zp_id = $1 AND c.status = 1`,
            [zp_id]
        );
        return result.rows;
    } catch (error) {
        console.error("Error in getCadre service:", error);
        throw error;
    }
};
// get cadre by id
exports.getCadreById = async (cadre_id) => {
    try {
        const result = await pool.query(
            `SELECT c.cadre_id, c.department_id, c.description, c.cadre_name, d.name 
             FROM cadre c
             JOIN departments d ON c.department_id = d.department_id
             WHERE c.cadre_id = $1 AND c.status = 1`,
            [cadre_id]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error in getCadreById service:", error);
        throw error;
    }
};
// update cadre
exports.updateCadre = async (cadre_id, department_id, description, cadre_name) => {
    try {
        const result = await pool.query(
            `UPDATE cadre SET department_id = $2, description = $3, cadre_name = $4 WHERE cadre_id = $1 AND status = 1 RETURNING *`,
            [cadre_id, department_id, description, cadre_name]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error in updateCadre service:", error);
        throw error;
    }
};
// delete cadre
exports.deleteCadre = async (cadre_id) => {
    try {
        const result = await pool.query(
            `UPDATE cadre SET status = 0 WHERE cadre_id = $1 AND status = 1 RETURNING *`,
            [cadre_id]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error in deleteCadre service:", error);
        throw error;
    }
};

// add post zp wise
exports.addPost = async (designation, department_id, zp_id) => {
    try {
        const result = await pool.query(
            `INSERT INTO posts (designation, department_id, zp_id) 
             VALUES ($1, $2, $3) RETURNING *`,
            [designation, department_id, zp_id]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error in addPost service:", error);
        throw error;
    }
};
// get post by zp wise
exports.getPostByZP = async (zp_id) => {
    try {
        const result = await pool.query(
            `SELECT p.post_id, p.designation, d.name AS department_name 
             FROM posts p
             JOIN departments d ON p.department_id = d.department_id
             WHERE p.zp_id = $1 AND p.status = 1`,
            [zp_id]
        );
        return result.rows;
    } catch (error) {
        console.error("Error in getPostByZP service:", error);
        throw error;
    }
};
// get post by id
exports.getPostById = async (post_id) => {
    try {
        const result = await pool.query(
            `SELECT p.post_id, p.designation, d.name AS department_name 
             FROM posts p
             JOIN departments d ON p.department_id = d.department_id
             WHERE p.post_id = $1 AND p.status = 1`,
            [post_id]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error in getPostById service:", error);
        throw error;
    }
};
// update post
exports.updatePost = async (post_id, designation, department_id) => {
    try {
        const result = await pool.query(
            `UPDATE posts SET designation = $2, department_id = $3 WHERE post_id = $1 AND status = 1 RETURNING *`,
            [post_id, designation, department_id]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error in updatePost service:", error);
        throw error;
    }
};
// delete post
exports.deletePost = async (post_id) => {
    try {
        const result = await pool.query(
            `UPDATE posts SET status = 0 WHERE post_id = $1 AND status = 1 RETURNING *`,
            [post_id]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error in deletePost service:", error);
        throw error;
    }
};

// add cadre post zp wise
exports.addCadrePost = async (cadre_id, post_id, zp_id,level_order,total_posts) => {
    try {
        const result = await pool.query(
            `INSERT INTO cadre_posts (cadre_id, post_id, zp_id, level_order, total_posts) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [cadre_id, post_id, zp_id, level_order, total_posts]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error in addCadrePost service:", error);
        throw error;
    }
};
// get cadre post by zp wise
exports.getCadrePostByZP = async (zp_id) => {
    try {
        const result = await pool.query(
            `SELECT cp.cadre_post_id,cp.level_order,cp.total_posts, c.cadre_name, p.designation, d.name AS department_name 
             FROM cadre_posts cp
             JOIN cadre c ON cp.cadre_id = c.cadre_id
             JOIN posts p ON cp.post_id = p.post_id
             JOIN departments d ON p.department_id = d.department_id
             WHERE cp.zp_id = $1 AND cp.status = 1`,
            [zp_id]
        );
        return result.rows;
    } catch (error) {
        console.error("Error in getCadrePostByZP service:", error);
        throw error;
    }
};
// get cadre post by cadre id
exports.getCadrePostByCadreId = async (cadre_id) => {
    try {
        const result = await pool.query(
            `SELECT cp.cadre_post_id,cp.level_order,cp.total_posts, c.cadre_name, p.designation, d.name AS department_name 
             FROM cadre_posts cp
             JOIN cadre c ON cp.cadre_id = c.cadre_id
                JOIN posts p ON cp.post_id = p.post_id
                JOIN departments d ON p.department_id = d.department_id
             WHERE cp.cadre_post_id = $1 AND cp.status = 1`,
            [cadre_id]
        );
        return result.rows;
    } catch (error) {
        console.error("Error in getCadrePostByCadreId service:", error);
        throw error;
    }
};
// update cadre post
exports.updateCadrePost = async (cadre_post_id, cadre_id, post_id, level_order, total_posts) => {
    try {
        const result = await pool.query(
            `UPDATE cadre_posts SET cadre_id = $2, post_id = $3, level_order = $4, total_posts = $5 WHERE cadre_post_id = $1 AND status = 1 RETURNING *`,
            [cadre_post_id, cadre_id, post_id, level_order, total_posts]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error in updateCadrePost service:", error);
        throw error;
    }
};
// delete cadre post
exports.deleteCadrePost = async (cadre_post_id) => {
    try {
        const result = await pool.query(
            `UPDATE cadre_posts SET status = 0 WHERE cadre_post_id = $1 AND status = 1 RETURNING *`,
            [cadre_post_id]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error in deleteCadrePost service:", error);
        throw error;
    }
};
// add roster template zp wise
exports.addRosterTemplate = async (point_no, caste_id, zp_id) => {
    try {
        const result = await pool.query(
            `INSERT INTO roster_template (point_no, caste_id, zp_id) 
             VALUES ($1, $2, $3) RETURNING *`,
            [point_no, caste_id, zp_id]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error in addRosterTemplate service:", error);
        throw error;
    }
};
// get roster template by zp wise
exports.getRosterTemplateByZP = async (zp_id) => {
    try {
        console.log("Fetching roster template for ZP ID:", zp_id);
        const result = await pool.query(
            `SELECT rt.template_id, rt.point_no, rt.caste_id, c.name,c.full_name, c.caste_id 
             FROM roster_template rt
             JOIN castes c ON rt.caste_id = c.caste_id
             WHERE rt.zp_id = $1 AND rt.status = 1`,
            [zp_id]
        );
        return result.rows;
    } catch (error) {
        console.error("Error in getRosterTemplateByZP service:", error);
        throw error;
    }
};
// get roster template by id
exports.getRosterTemplateById = async (template_id) => {
    try {
        const result = await pool.query(
            `SELECT rt.template_id, rt.point_no, rt.caste_id, c.name, c.caste_id 
             FROM roster_template rt
             JOIN castes c ON rt.caste_id = c.caste_id
             WHERE rt.template_id = $1 AND rt.status = 1`,
            [template_id]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error in getRosterTemplateById service:", error);
        throw error;
    }
};
// update roster template
exports.updateRosterTemplate = async (template_id, point_no, caste_id) => {
    try {
        const result = await pool.query(
            `UPDATE roster_template  SET point_no = $2, caste_id = $3 WHERE template_id = $1 AND status = 1 RETURNING *`,
            [template_id, point_no, caste_id]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error in updateRosterTemplate service:", error);
        throw error;
    }
};
// delete roster template
exports.deleteRosterTemplate = async (template_id) => {
    try {
        const result = await pool.query(
            `UPDATE roster_template SET status = 0 WHERE template_id = $1 AND status = 1 RETURNING *`,
            [template_id]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error in deleteRosterTemplate service:", error);
        throw error;
    }
};


exports.generateRosterByZP = async (zp_id) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const postsRes = await client.query(`
            SELECT cadre_post_id, total_posts
            FROM cadre_posts
            WHERE zp_id = $1 AND status = 1
        `, [zp_id]);


        if (postsRes.rows.length === 0) {
            throw new Error("No cadre posts found for this ZP");
        }

        let resultSummary = [];

        for (const post of postsRes.rows) {
            const { cadre_post_id, total_posts } = post;

            const existing = await client.query(`
                SELECT COUNT(*) 
                FROM roster_points 
                WHERE cadre_post_id = $1 
                  AND zp_id = $2 
                  AND status = 1
            `, [cadre_post_id, zp_id]);

            if (parseInt(existing.rows[0].count) > 0) {
                console.log(`Skipping ${cadre_post_id} (already generated)`);
                continue;
            }

         const cycleSize = post.cycle_size || 100;

while (inserted < total_posts) {
    const limit = Math.min(cycleSize, total_posts - inserted);

    await client.query(`
        INSERT INTO roster_points (cadre_post_id, point_no, caste_id, cycle_no, zp_id)
        SELECT $1, point_no + $4, caste_id, $5, $2
        FROM roster_template
        WHERE status = 1
        ORDER BY point_no
        LIMIT $3
    `, [cadre_post_id, zp_id, limit, (cycle - 1) * cycleSize, cycle]);

    inserted += limit;
    cycle++;
}

            await logAudit("ROSTER_GENERATED", cadre_post_id, zp_id, null, client);

            resultSummary.push({
                cadre_post_id,
                status: "generated"
            });
        }

        await client.query("COMMIT");

        return resultSummary;

    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
};


//  Create Vacancy
exports.createVacanciesByZP = async (zp_id) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const points = await client.query(`
            SELECT *
            FROM roster_points
            WHERE is_filled = FALSE
              AND vacancy_id IS NULL
              AND zp_id = $1
            ORDER BY cadre_post_id, point_no
        `, [zp_id]);
        if (points.rows.length === 0) {
            throw new Error("No available roster points");
        }

        let created = [];

        for (const rp of points.rows) {

            const vacancy = await client.query(`
                INSERT INTO vacancies (cadre_post_id, roster_point, caste_id, status, zp_id)
                VALUES ($1, $2, $3, 'OPEN', $4)
                RETURNING *;
            `, [rp.cadre_post_id, rp.point_no, rp.caste_id, zp_id]);

            await client.query(`
                UPDATE roster_points
                SET vacancy_id = $1
                WHERE roster_id = $2
            `, [vacancy.rows[0].vacancy_id, rp.roster_id]);

            created.push(vacancy.rows[0]);

            await logAudit(
                "VACANCY_CREATED",
                rp.cadre_post_id,   
                zp_id,
                vacancy.rows[0].vacancy_id,
                client
            );
        }

        await client.query("COMMIT");

        return created;

    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
};



//  Fill Vacancy
exports.fillVacancy = async (vacancy_id, user_id, zp_id) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        //  find vacancy
        const vacancyRes = await client.query(`
            SELECT * FROM vacancies 
            WHERE vacancy_id = $1 AND zp_id = $2
            FOR UPDATE
        `, [vacancy_id, zp_id]);
// console.log("zp id",zp_id);
        if (vacancyRes.rows.length === 0) {
            throw new Error("Vacancy not found");
        }

        const v = vacancyRes.rows[0];

        if (v.status === 'FILLED') {
            throw new Error("Vacancy already filled");
        }

        // Check user 
        const userCheck = await client.query(`
            SELECT up.current_vacancy_id,u.zp_id FROM user_profile up
JOIN users u ON up.user_id = u.user_id
            WHERE up.user_id = $1 AND u.zp_id = $2
        `, [user_id, zp_id]);

        if (userCheck.rows.length === 0) {
            throw new Error("User not found in this ZP");
        }

        if (userCheck.rows[0].current_vacancy_id) {
            throw new Error("User already assigned to another vacancy");
        }

        // Fill vacancy
        await client.query(`
            UPDATE vacancies
            SET status = 'FILLED',
                user_id = $2,
                filled_at = NOW()
            WHERE vacancy_id = $1
        `, [vacancy_id, user_id]);

        //  Update roster_points 
        await client.query(`
            UPDATE roster_points
            SET is_filled = TRUE
            WHERE vacancy_id = $1
        `, [vacancy_id]);

        //  Update user_profile 
        await client.query(`
            UPDATE user_profile
            SET current_vacancy_id = $2
            WHERE user_id = $1
        `, [user_id, vacancy_id]);

        //  Update filled count
        await client.query(`
            UPDATE cadre_posts
            SET filled_posts = filled_posts + 1
            WHERE cadre_post_id = $1
        `, [v.cadre_post_id]);

        // Log movement 
        await client.query(`
            INSERT INTO employee_movements (
                user_id, movement_type, to_vacancy_id
            ) VALUES ($1, 'JOIN', $2)
        `, [user_id, vacancy_id]);

        await logAudit("VACANCY_FILLED", v.cadre_post_id, zp_id, vacancy_id, client);

        await client.query("COMMIT");

        return { success: true };

    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
};

exports.retireEmployee = async (user_id, zp_id) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Get user 
        const userRes = await client.query(`
            SELECT current_vacancy_id,
                   retirement_date,
                   (retirement_date IS NOT NULL AND retirement_date <= NOW()) AS can_retire
            FROM user_profile 
            WHERE user_id = $1 AND zp_id = $2
            FOR UPDATE
        `, [user_id, zp_id]);

        if (userRes.rows.length === 0) {
            throw new Error("User not found in this ZP");
        }

        const user = userRes.rows[0];

        const vacancy_id = user.current_vacancy_id;
        if (!vacancy_id) {
            throw new Error("User not assigned to any vacancy");
        }

        if (!user.can_retire) {
            throw new Error(`User cannot be retired before retirement date: ${user.retirement_date}`);
        }
        
        //  open vacancy
        await client.query(`
            UPDATE vacancies
            SET status = 'OPEN',
                user_id = NULL,
                filled_at = NULL
            WHERE vacancy_id = $1 AND zp_id = $2
        `, [vacancy_id, zp_id]);

        //  Update roster 
        await client.query(`
            UPDATE roster_points
            SET is_filled = FALSE
            WHERE vacancy_id = $1
        `, [vacancy_id]);

        //  Update user
        await client.query(`
            UPDATE user_profile
            SET status = 0,
                current_vacancy_id = NULL
            WHERE user_id = $1
        `, [user_id]);

        await client.query(`
            UPDATE cadre_posts cp
            JOIN vacancies v ON cp.cadre_post_id = v.cadre_post_id
            SET filled_posts = filled_posts - 1
            WHERE v.vacancy_id = $1 AND v.zp_id = $2
        `, [vacancy_id, zp_id]);
        //  Log movement
        await client.query(`
            INSERT INTO employee_movements (
                user_id, movement_type, from_vacancy_id,zp_id
            ) VALUES ($1, 'RETIREMENT', $2, $3)
        `, [user_id, vacancy_id, zp_id]);

        await client.query("COMMIT");

        return { success: true };

    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
};

exports.promoteEmployee = async (user_id, new_vacancy_id, zp_id) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Get user current vacancy
        const userRes = await client.query(`
            SELECT current_vacancy_id FROM user_profile
            WHERE user_id = $1
        `, [user_id]);

        const old_id = userRes.rows[0]?.current_vacancy_id;
        if (!old_id) throw new Error("User has no current vacancy");

        // open old vacancy
        await client.query(`
            UPDATE vacancies SET status='OPEN', user_id=NULL WHERE vacancy_id=$1
        `, [old_id]);

        await client.query(`
            UPDATE roster_points SET is_filled=FALSE WHERE vacancy_id=$1
        `, [old_id]);

        //  Assign new vacancy
        await client.query(`
            UPDATE vacancies 
            SET status='FILLED', user_id=$2, filled_at=NOW()
            WHERE vacancy_id=$1 AND zp_id=$3
        `, [new_vacancy_id, user_id, zp_id]);

        await client.query(`
            UPDATE roster_points SET is_filled=TRUE WHERE vacancy_id=$1
        `, [new_vacancy_id]);

        //  Update user set new vacancy
        await client.query(`
            UPDATE user_profile
            SET current_vacancy_id = $2
            WHERE user_id = $1
        `, [user_id, new_vacancy_id]);

        //  log movement
        await client.query(`
            INSERT INTO employee_movements (
                user_id, movement_type, from_vacancy_id, to_vacancy_id,zp_id
            ) VALUES ($1, 'PROMOTION', $2, $3, $4)
        `, [user_id, old_id, new_vacancy_id, zp_id]);

        await client.query("COMMIT");

        return { success: true };

    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
};

exports.transferEmployee = async (user_id, new_vacancy_id, new_zp_id) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        //  Get user
        const userRes = await client.query(`
            SELECT current_vacancy_id, zp_id FROM user_profile
            WHERE user_id = $1
        `, [user_id]);

        const old_id = userRes.rows[0]?.current_vacancy_id;
        const old_zp = userRes.rows[0]?.zp_id;

        if (!old_id) throw new Error("User has no current vacancy");

        // open old ZP vacancy
        await client.query(`
            UPDATE vacancies SET status='OPEN', user_id=NULL WHERE vacancy_id=$1
        `, [old_id]);

        await client.query(`
            UPDATE roster_points SET is_filled=FALSE WHERE vacancy_id=$1
        `, [old_id]);

        // Assign new ZP vacancy
        await client.query(`
            UPDATE vacancies 
            SET status='FILLED', user_id=$2, filled_at=NOW()
            WHERE vacancy_id=$1
        `, [new_vacancy_id, user_id]);

        await client.query(`
            UPDATE roster_points SET is_filled=TRUE WHERE vacancy_id=$1
        `, [new_vacancy_id]);

        //  Update user
        await client.query(`
            UPDATE user_profile
            SET zp_id = $2,
                current_vacancy_id = $3
            WHERE user_id = $1
        `, [user_id, new_zp_id, new_vacancy_id]);

        // log movement
        await client.query(`
            INSERT INTO employee_movements (
                user_id, movement_type,
                from_zp, to_zp,
                from_vacancy_id, to_vacancy_id
            ) VALUES ($1, 'TRANSFER', $2, $3, $4, $5)
        `, [user_id, old_zp, new_zp_id, old_id, new_vacancy_id]);

        await client.query("COMMIT");

        return { success: true };

    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
};







