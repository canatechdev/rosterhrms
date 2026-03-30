// CONTROLLER
const authController = require('../../controllers/auth/auth.controller');
const { reqBody } = require('../../middlewares/req_body.middleware');
const authMiddleware = require('../../middlewares/auth.middleware');

const router = (require('express')).Router();

router.post('/register_zp_admin',authMiddleware, reqBody, authController.register_zp_admin);
router.post("/login", reqBody, authController.login);

router.post('/register_dept_head',authMiddleware, reqBody, authController.register_dept_head);
// router.post("/request_otp", reqBody, authController.requestOTP);
// router.post("/resend_otp", reqBody, authController.resendOTP);
// router.post("/verify_otp", reqBody, authController.verifyOTP);
router.delete("/logout", authController.logout);
router.post("/refresh", authController.refresh);


router.post("/initiate", reqBody, authController.initiateAuth);

module.exports = router;
