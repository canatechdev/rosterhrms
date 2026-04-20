// CONTROLLER
const authController = require('../../controllers/system/system.controller.js');
// const systemController = require('../../controllers/system/system.controller.js');
const { reqBody } = require('../../middlewares/req_body.middleware.js');
const authMiddleware = require('../../middlewares/auth.middleware.js');

const router = (require('express')).Router();

router.get('/casts', authMiddleware, authController.getCasts);
// router.post("/", reqBody, authController.login);
// router.get('/roles',authMiddleware, authController.getRoles);

router.get('/get_employees', authController.getEmployees);

router.get('/posts/:department_id', authMiddleware, authController.getPosts);


// router.get("/departments/head", authMiddleware, authController.getDepartmentHead);
// router.get("/zp/admins/:zp_name", authMiddleware, authController.getZPAdmins);



module.exports = router;