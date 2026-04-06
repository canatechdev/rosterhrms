const pool = require('../../config/database');

const createPost = async (department_id, designation, total_positions) => {
    const result = await pool.query(
        'INSERT INTO posts (department_id, designation, total_positions) VALUES ($1, $2, $3) RETURNING *',
        [department_id, designation, total_positions]
    );
    return result.rows[0];
};

const getPosts = async () => {
    const result = await pool.query(`
        SELECT p.*, d.name as department_name
        FROM posts p
        LEFT JOIN departments d ON p.department_id = d.department_id
        ORDER BY p.post_id ASC
    `);
    return result.rows;
};

const getPostById = async (id) => {
    const result = await pool.query('SELECT * FROM posts WHERE post_id = $1', [id]);
    return result.rows[0];
};

const updatePost = async (id, department_id, designation, total_positions, status) => {
    const result = await pool.query(
        'UPDATE posts SET department_id = $1, designation = $2, total_positions = $3, status = $4, updated_at = NOW() WHERE post_id = $5 RETURNING *',
        [department_id, designation, total_positions, status, id]
    );
    return result.rows[0];
};

const deletePost = async (id) => {
    await pool.query('DELETE FROM posts WHERE post_id = $1', [id]);
};

module.exports = {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
};
