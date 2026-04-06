const postService = require('../../services/system/post.service.js');
const asyncHandler = require('../../middlewares/async_handler.js');

const createPost = asyncHandler(async (req, res) => {
    const { department_id, designation, total_positions } = req.body;
    const post = await postService.createPost(department_id, designation, total_positions);
    res.status(201).json({ success: true, data: post });
});

const getPosts = asyncHandler(async (req, res) => {
    const posts = await postService.getPosts();
    res.status(200).json({ success: true, data: posts });
});

const getPostById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const post = await postService.getPostById(id);
    if (!post) {
        return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.status(200).json({ success: true, data: post });
});

const updatePost = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { department_id, designation, total_positions, status } = req.body;
    const post = await postService.updatePost(id, department_id, designation, total_positions, status);
    if (!post) {
        return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.status(200).json({ success: true, data: post });
});

const deletePost = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await postService.deletePost(id);
    res.status(200).json({ success: true, message: 'Post deleted successfully' });
});

module.exports = {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
};
