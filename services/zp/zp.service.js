const pool = require("../../config/database");


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
             JOIN department d ON c.department_id = d.department_id
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
             JOIN department d ON c.department_id = d.department_id
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
            `INSERT INTO post (designation, department_id, zp_id) 
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
             FROM post p
             JOIN department d ON p.department_id = d.department_id
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
             FROM post p
             JOIN department d ON p.department_id = d.department_id
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
            `UPDATE post SET designation = $2, department_id = $3 WHERE post_id = $1 AND status = 1 RETURNING *`,
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
            `UPDATE post SET status = 0 WHERE post_id = $1 AND status = 1 RETURNING *`,
            [post_id]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error in deletePost service:", error);
        throw error;
    }
};

// add cadre post zp wise
exports.addCadrePost = async (cadre_id, post_id, zp_id) => {
    try {
        const result = await pool.query(
            `INSERT INTO cadre_post (cadre_id, post_id, zp_id) 
             VALUES ($1, $2, $3) RETURNING *`,
            [cadre_id, post_id, zp_id]
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
            `SELECT cp.cadre_post_id, c.cadre_name, p.designation, d.name AS department_name 
             FROM cadre_post cp
             JOIN cadre c ON cp.cadre_id = c.cadre_id
             JOIN post p ON cp.post_id = p.post_id
             JOIN department d ON p.department_id = d.department_id
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
            `SELECT cp.cadre_post_id, c.cadre_name, p.designation, d.name AS department_name 
             FROM cadre_post cp
             JOIN cadre c ON cp.cadre_id = c.cadre_id
                JOIN post p ON cp.post_id = p.post_id
                JOIN department d ON p.department_id = d.department_id
             WHERE cp.cadre_id = $1 AND cp.status = 1`,
            [cadre_id]
        );
        return result.rows;
    } catch (error) {
        console.error("Error in getCadrePostByCadreId service:", error);
        throw error;
    }
};
// delete cadre post
exports.deleteCadrePost = async (cadre_post_id) => {
    try {
        const result = await pool.query(
            `UPDATE cadre_post SET status = 0 WHERE cadre_post_id = $1 AND status = 1 RETURNING *`,
            [cadre_post_id]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error in deleteCadrePost service:", error);
        throw error;
    }
};






