// CONTROLLER
const authController = require('../../controllers/system/system.controller.js');
const { reqBody } = require('../../middlewares/req_body.middleware.js');
const authMiddleware = require('../../middlewares/auth.middleware.js');

const router = (require('express')).Router();

router.get('/casts',authMiddleware, authController.getCasts);
// router.post("/", reqBody, authController.login);
router.get('/roles',authMiddleware, authController.getRoles);

router.get('/departments',authMiddleware, authController.getDepartments);
router.get('/posts/:department_id',authMiddleware, authController.getPosts);


router.get("/departments/head", authMiddleware, authController.getDepartmentHead);
router.get("/zp/admins", authMiddleware, authController.getZPAdmins);



module.exports = router;
