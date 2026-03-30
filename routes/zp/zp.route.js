// CONTROLLER
const zpController = require('../../controllers/zp/zp.controller');
const { reqBody } = require('../../middlewares/req_body.middleware');
const authMiddleware = require('../../middlewares/auth.middleware');
const router = (require('express')).Router();

router.post('/', (req, res) => {
    res.json({ message: "ZP route is working" });
});

// cadre crud 
router.post('/add_cadre',authMiddleware, reqBody, zpController.addCadre);
router.get('/get_cadre', authMiddleware, zpController.getCadre);
router.get('/get_cadre/:cadre_id', authMiddleware, zpController.getCadreById);
router.put('/update_cadre/:cadre_id', authMiddleware, reqBody, zpController.updateCadre);
router.delete('/delete_cadre/:cadre_id', authMiddleware, zpController.deleteCadre);

// post crud 
router.post('/add_post', authMiddleware, reqBody, zpController.addPost);
router.get('/get_post', authMiddleware, zpController.getPostByZP);
router.get('/get_post/:post_id', authMiddleware, zpController.getPostById);
router.put('/update_post/:post_id', authMiddleware, reqBody, zpController.updatePost);
router.delete('/delete_post/:post_id', authMiddleware, zpController.deletePost);

// cadre post crud
router.post('/add_cadre_post', authMiddleware, reqBody, zpController.addCadrePost);
router.get('/get_cadre_post', authMiddleware, zpController.getCadrePostByZP);
router.get('/get_cadre_post/:cadre_id', authMiddleware, zpController.getCadrePostByCadreId);
router.delete('/delete_cadre_post/:cadre_post_id', authMiddleware, zpController.deleteCadrePost);


module.exports = router;
