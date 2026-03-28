// CONTROLLER
const authController = require('../../controllers/auth/auth.controller');
const { reqBody } = require('../../middlewares/req_body.middleware');

const router = (require('express')).Router();

router.post('/register', reqBody, authController.register);
router.post("/request_otp", reqBody, authController.requestOTP);
router.post("/resend_otp", reqBody, authController.resendOTP);
router.post("/verify_otp", reqBody, authController.verifyOTP);
router.post("/login", reqBody, authController.login);
router.delete("/logout", authController.logout);
router.post("/refresh", authController.refresh);

router.post("/initiate", reqBody, authController.initiateAuth);

module.exports = router;
