const pool = require('../../config/database');
const { logAudit } = require("../../config/logAudit");

 exports.createZp = async (name, district_id,name_mr) => {
    const result = await pool.query(
        'INSERT INTO zp (name, district_id,name_mr) VALUES ($1, $2,$3) RETURNING *',
        [name, district_id,name_mr]
    );
    return result.rows[0];
};

exports.getZps = async () => {
    const result = await pool.query(`
        SELECT z.*, d.name,d.name_mr 
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

exports.updateZp = async (id, name, district_id, status,name_mr) => {
    const result = await pool.query(
        'UPDATE zp SET name = $1, district_id = $2, status = $3, name_mr = $4, updated_at = NOW() WHERE zp_id = $5 RETURNING *',
        [name, district_id, status, name_mr, id]
    );
    return result.rows[0];
};

exports.deleteZp = async (id) => {
    await pool.query('DELETE FROM zp WHERE zp_id = $1', [id]);
};

// add cadre zp wise 
exports.addCadre = async (department_id, description, cadre_name, cadre_name_mr, description_mr, zp_id) => {
    try {
        const result = await pool.query(
            `INSERT INTO cadre (department_id, description, cadre_name,cadre_name_mr, description_mr, zp_id) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [department_id, description, cadre_name, cadre_name_mr, description_mr, zp_id]
        );

        return result.rows[0];
    } catch (error) {
        console.error("Error in addCadre service:", error);
        throw error;
    }
};
// add department zp wise 
exports.addDepartment = async(name,zp_id,name_mr)=>{
    try{
const result = await pool.query(
    `INSERT INTO departments (name,name_mr, zp_id) VALUES ($1, $2, $3) RETURNING *`,
    [name, name_mr, zp_id]
);
console.log(name,name_mr,zp_id);
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
        const result = await pool.query(`SELECT name,name_mr FROM departments WHERE zp_id = $1 AND status = 1`, [zp_id]);
        return result.rows;
    } catch (error) {
        console.error("Error in getDepartmentByZP service:", error);
        throw error;
    }
};
// get department by id
exports.getDepartmentById = async(department_id)=>{
    try {  
        const result = await pool.query(`SELECT name,name_mr FROM 
            departments WHERE department_id = $1 AND status = 1`, [department_id]);
        return result.rows[0];
} catch (error) {
    console.error("Error in getDepartmentById service:", error);
    throw error;
}
}
// update department
exports.updateDepartment = async(department_id,name,name_mr)=>{
    try{
        const result = await pool.query(`UPDATE departments SET name = $2, name_mr = $3 WHERE department_id = $1 AND status = 1 RETURNING *`,[department_id,name,name_mr]);
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
            `SELECT c.cadre_id, c.department_id, c.description, c.cadre_name,c.cadre_name_mr,c.description_mr, d.name,d.name_mr 
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
            `SELECT c.cadre_id, c.department_id, c.description, c.cadre_name,c.cadre_name_mr,c.description_mr, d.name,d.name_mr
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
exports.updateCadre = async (cadre_id, department_id, description, cadre_name, cadre_name_mr, description_mr) => {
    try {
        const result = await pool.query(
            `UPDATE cadre SET department_id = $2, description = $3, cadre_name = $4, cadre_name_mr = $5, description_mr = $6 WHERE cadre_id = $1 AND status = 1 RETURNING *`,
            [cadre_id, department_id, description, cadre_name, cadre_name_mr, description_mr]
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
exports.addPost = async ( designation, designation_mr, department_id, zp_id, cadre_id, level_order, total_posts) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const postRes = await client.query(`
            INSERT INTO posts (designation,designation_mr, department_id, zp_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `, [designation, designation_mr, department_id, zp_id]);

        const post = postRes.rows[0];
        const post_id = post.post_id;

        const cadrePostRes = await client.query(`
            INSERT INTO cadre_posts (
                cadre_id,
                post_id,
                level_order,
                total_posts,
                zp_id,
                filled_posts,
                status,
                cycle_size
            )
            VALUES ($1, $2, $3, $4, $5, 0, 1, 100)
            RETURNING *
        `, [cadre_id, post_id, level_order, total_posts, zp_id]);

        await client.query("COMMIT");

        return {
            post,
            cadre_post: cadrePostRes.rows[0]
        };

    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error in addPost service:", error);
        throw error;
    } finally {
        client.release();
    }
};
// get post by zp wise
exports.getPostByZP = async (zp_id) => {
    try {
        const result = await pool.query(
            `SELECT p.post_id, p.designation,p.designation_mr, d.name,d.name_mr,
            cp.cadre_id,cp.level_order,cp.total_posts,cp.filled_posts,c.cadre_name,c.cadre_name_mr
             FROM posts p
             JOIN departments d ON p.department_id = d.department_id
            JOIN cadre_posts cp ON p.post_id = cp.post_id
            JOIN cadre c ON cp.cadre_id = c.cadre_id
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
        const result = await pool.query(`
            SELECT 
                p.post_id,
                p.designation,
                p.designation_mr,
                p.department_id,
                d.name,
                d.name_mr,
                cp.cadre_id,
                cp.level_order,
                cp.total_posts,
                cp.cadre_post_id,
                c.cadre_name,
                c.cadre_name_mr
            FROM posts p
            JOIN departments d ON p.department_id = d.department_id
            JOIN cadre_posts cp ON p.post_id = cp.post_id
            JOIN cadre c ON cp.cadre_id = c.cadre_id
            WHERE p.post_id = $1 AND p.status = 1
        `, [post_id]);

        return result.rows[0];

    } catch (error) {
        console.error("Error in getPostById:", error);
        throw error;
    }
};
// update post
exports.updatePost = async (
    post_id,
    designation,
    designation_mr,
    department_id,
    cadre_id,
    level_order,
    total_posts
) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        //  Update posts table
        const postRes = await client.query(`
            UPDATE posts
            SET designation = $2,
                designation_mr = $3,
                department_id = $4
            WHERE post_id = $1 AND status = 1
            RETURNING *
        `, [post_id, designation, designation_mr, department_id]);

        if (postRes.rows.length === 0) {
            await client.query("ROLLBACK");
            return null;
        }

        // Update cadre_posts table
        const cpRes = await client.query(`
            UPDATE cadre_posts
            SET cadre_id = $2,
                level_order = $3,
                total_posts = $4
            WHERE post_id = $1
            RETURNING *
        `, [post_id, cadre_id, level_order, total_posts]);

        await client.query("COMMIT");

        return {
            post: postRes.rows[0],
            cadre_post: cpRes.rows[0]
        };

    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error in updatePost service:", error);
        throw error;
    } finally {
        client.release();
    }
};
// delete post
exports.deletePost = async (post_id) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const check = await client.query(`
            SELECT post_id FROM posts 
            WHERE post_id = $1 AND status = 1
        `, [post_id]);

        if (check.rows.length === 0) {
            await client.query("ROLLBACK");
            return null;
        }

        const cadrePosts = await client.query(`
            SELECT cadre_post_id 
            FROM cadre_posts 
            WHERE post_id = $1 AND status = 1
        `, [post_id]);

        const cadrePostIds = cadrePosts.rows.map(r => r.cadre_post_id);

        console.log("cadrePostIds:", cadrePostIds);

        if (cadrePostIds.length > 0) {
            const used = await client.query(`
                SELECT 1 FROM vacancies 
                WHERE cadre_post_id = ANY($1::int[]) 
                LIMIT 1
            `, [cadrePostIds]);

            if (used.rows.length > 0) {
                throw new Error("Cannot delete: Post is already used in vacancies");
            }
        }

        await client.query(`
            UPDATE cadre_posts
            SET status = 0
            WHERE post_id = $1
        `, [post_id]);

        const postRes = await client.query(`
            UPDATE posts
            SET status = 0
            WHERE post_id = $1
            RETURNING *
        `, [post_id]);

        await client.query("COMMIT");

        return postRes.rows[0];

    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error in deletePost service:", error);
        throw error;
    } finally {
        client.release();
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
console.log("Posts for roster generation:", postsRes.rows);

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
let inserted = 0;
let cycle = 1;
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
const caste = await client.query(`
    SELECT c.caste_id, c.name
    FROM vacancies v
    JOIN castes c ON v.caste_id = c.caste_id
    WHERE v.vacancy_id = $1
`, [vacancy_id]);

if (caste.rows.length === 0) {
    throw new Error("Vacancy not found");
}

const vacancyCaste = caste.rows[0];
console.log("Vacancy caste:", vacancyCaste);

const userRes = await client.query(`
    SELECT caste_id
    FROM users
    WHERE user_id = $1
`, [user_id]);

if (userRes.rows.length === 0) {
    throw new Error("User not found");
}

const userCaste = userRes.rows[0].caste_id;
console.log("User caste:", userCaste);


if (vacancyCaste.name !== "General") {

    if (userCaste !== vacancyCaste.caste_id) {
        throw new Error("Only reserved category candidate allowed vacancy caste not matched:", vacancyCaste.name,"User Caste:");
    }
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

exports.getRosterByCadrePost = async (cadre_post_id, zp_id, filters = {}) => {
    try {

        let query = `
            SELECT 
                c.cadre_name,
                c.cadre_name_mr,
                cp.cadre_post_id,
                cp.total_posts,
                cp.filled_posts,
                d.name AS department_name,
                d.name_mr,
                p.post_id,
                p.designation,
                p.designation_mr,
                v.vacancy_id,
                v.roster_point,
                v.caste_id,
                cs.name AS caste_name,
                cs.name_mr AS caste_name_mr,
                v.status
            FROM cadre_posts cp
            JOIN cadre c ON cp.cadre_id = c.cadre_id
            JOIN posts p ON cp.post_id = p.post_id
            JOIN departments d ON p.department_id = d.department_id
            
            JOIN vacancies v 
                ON cp.cadre_post_id = v.cadre_post_id
            
            LEFT JOIN castes cs 
                ON v.caste_id = cs.caste_id
            
            WHERE cp.cadre_post_id = $1
            AND cp.zp_id = $2
            AND cp.status = 1
        `;

        let values = [cadre_post_id, zp_id];
        let index = 3;

        if (filters.caste_id) {
            query += ` AND v.caste_id = $${index++}`;
            values.push(filters.caste_id);
        }

        if (filters.status) {
            query += ` AND v.status = $${index++}`;
            values.push(filters.status);
        }

        if (filters.roster_point) {
            query += ` AND v.roster_point = $${index++}`;
            values.push(filters.roster_point);
        }

        query += ` ORDER BY v.roster_point ASC`;

        const result = await pool.query(query, values);

        return result.rows;

    } catch (error) {
        console.error("Error in getRosterByCadrePost service:", error);
        throw error;
    }
};

exports.retireEmployeesForAllZPs = async () => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        //  Get all ZPs
        const zpRes = await client.query(`
            SELECT zp_id FROM zp WHERE status = 1
        `);

        const zpList = zpRes.rows;

        let total_retired = 0;
        let zp_summary = [];

        for (const zp of zpList) {
            const zp_id = zp.zp_id;

            // Get eligible employees for this ZP
            const usersRes = await client.query(`
                SELECT user_id, current_vacancy_id
                FROM user_profile
                WHERE zp_id = $1
                  AND retirement_date IS NOT NULL
                  AND retirement_date <= NOW()
                  AND current_vacancy_id IS NOT NULL
                  AND status = 1
            `, [zp_id]);

            const users = usersRes.rows;

            let retired_count = 0;

            for (const user of users) {
                const { user_id, current_vacancy_id } = user;

                //  Open vacancy
                await client.query(`
                    UPDATE vacancies
                    SET status = 'OPEN',
                        user_id = NULL,
                        filled_at = NULL
                    WHERE vacancy_id = $1 AND zp_id = $2
                `, [current_vacancy_id, zp_id]);

                //  Update roster
                await client.query(`
                    UPDATE roster_points
                    SET is_filled = FALSE
                    WHERE vacancy_id = $1
                `, [current_vacancy_id]);

                //  Update user
                await client.query(`
                    UPDATE user_profile
                    SET status = 0,
                        current_vacancy_id = NULL
                    WHERE user_id = $1
                `, [user_id]);

                //  Update cadre posts 
                await client.query(`
                    UPDATE cadre_posts cp
                    SET filled_posts = filled_posts - 1
                    FROM vacancies v
                    WHERE cp.cadre_post_id = v.cadre_post_id
                      AND v.vacancy_id = $1
                      AND v.zp_id = $2
                `, [current_vacancy_id, zp_id]);

                //  Log movement
                await client.query(`
                    INSERT INTO employee_movements (
                        user_id, movement_type, from_vacancy_id, zp_id
                    ) VALUES ($1, 'RETIREMENT', $2, $3)
                `, [user_id, current_vacancy_id, zp_id]);

                retired_count++;
            }

            total_retired += retired_count;

            zp_summary.push({
                zp_id,
                retired_count
            });
        }

        await client.query("COMMIT");

        return {
            total_retired,
            zp_summary
        };

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



exports.getZPAdmins = async (zp_name) => {
    const admins = await pool.query(`SELECT u.user_id,u.email,up.first_name,up.last_name,r.name as Role,zp.name as ZP,
        jsonb_agg(
        jsonb_build_object(
            'permission_id', p.permission_id,
            'name', p.name
        )
    ) AS permissions
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        JOIN employee_profiles up ON u.user_id=up.user_id
        JOIN zp ON u.zp_id=zp.zp_id
        JOIN role_permissions rp ON rp.role_id = r.role_id
        JOIN permissions p ON p.permission_id = rp.permission_id
        WHERE r.name='zp_admin' AND zp.name=$1
        GROUP BY u.user_id,u.email,up.first_name,up.last_name,r.name,zp.name`, [zp_name]);
    return admins.rows;
}




