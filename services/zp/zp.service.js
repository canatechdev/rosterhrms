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

          const cycleSize = 100;
let inserted = 0;
let cycle = 1;

while (inserted < total_posts) {
    const limit = Math.min(cycleSize, total_posts - inserted);

    await client.query(`
        INSERT INTO roster_points (cadre_post_id, point_no, caste_id,cycle_no, zp_id)
        SELECT $1, point_no + $4, caste_id, $5, $2
        FROM roster_template
        WHERE status = 1
        ORDER BY point_no
        LIMIT $3
    `, [cadre_post_id, zp_id, limit, cycle * 100, cycle]);

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
exports.fillVacancy = async (vacancy_id, user_id = null, zp_id ) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const vacancyRes = await client.query(`
            SELECT * FROM vacancies 
            WHERE vacancy_id = $1  AND zp_id = $2
            FOR UPDATE
        `, [vacancy_id, zp_id]);

        if (vacancyRes.rows.length === 0) {
            throw new Error("Vacancy not found");
        }

        const v = vacancyRes.rows[0];

        if (v.status === 'FILLED') {
            throw new Error("Vacancy already filled");
        }

        await client.query(`
            UPDATE vacancies
            SET status = 'FILLED',
                user_id = $2,
                filled_at = NOW()
            WHERE vacancy_id = $1
        `, [vacancy_id, user_id]);

        await client.query(`
            UPDATE roster_points
            SET is_filled = TRUE
            WHERE cadre_post_id = $1
              AND point_no = $2
              AND zp_id = $3
        `, [v.cadre_post_id, v.roster_point, zp_id]);

        await client.query(`
            UPDATE cadre_posts
            SET filled_posts = filled_posts + 1
            WHERE cadre_post_id = $1
        `, [v.cadre_post_id]);

        await logAudit("VACANCY_FILLED", v.cadre_post_id, vacancy_id,zp_id, client);

        await client.query("COMMIT");

        return { success: true };

    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
};







