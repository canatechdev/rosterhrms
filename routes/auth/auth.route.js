// CONTROLLER
const authController = require('../../controllers/auth/auth.controller');
const { reqBody } = require('../../middlewares/req_body.middleware');
const authMiddleware = require('../../middlewares/auth.middleware');

const router = (require('express')).Router();

router.post('/register_zp_admin', authMiddleware, reqBody, authController.register_zp_admin);
router.post('/register_dept_head', authMiddleware, reqBody, authController.register_dept_head);
router.post('/register_employee', authMiddleware, reqBody, authController.register_employee);

router.post("/login", reqBody, authController.loginSuperAdmin);
router.post("/login/:zp_name", reqBody, authController.login);

router.delete("/logout", authController.logout);
router.post("/refresh", authController.refresh);


router.post("/initiate", reqBody, authController.initiateAuth);


router.post("/change_password", authMiddleware, reqBody, authController.changePassword);
router.post("/reset_password", authMiddleware, reqBody, authController.resetPassword);
module.exports = router;
