const router = (require('express')).Router();
const postController = require('../../controllers/system/post.controller.js');
const { reqBody } = require('../../middlewares/req_body.middleware.js');
const authMiddleware = require('../../middlewares/auth.middleware.js');

router.post('/', authMiddleware, reqBody, postController.createPost);
router.get('/', authMiddleware, postController.getPosts);
router.get('/:id', authMiddleware, postController.getPostById);
router.put('/:id', authMiddleware, reqBody, postController.updatePost);
router.delete('/:id', authMiddleware, postController.deletePost);

module.exports = router;