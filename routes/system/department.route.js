const router = (require('express')).Router();
const departmentController = require('../../controllers/system/department.controller.js');
const { reqBody } = require('../../middlewares/req_body.middleware.js');
const authMiddleware = require('../../middlewares/auth.middleware.js');

router.post('/', authMiddleware, reqBody, departmentController.createDepartment);
router.get('/', authMiddleware, departmentController.getDepartments);
router.get('/:id', authMiddleware, departmentController.getDepartmentById);
router.put('/:id', authMiddleware, reqBody, departmentController.updateDepartment);
router.delete('/:id', authMiddleware, departmentController.deleteDepartment);

module.exports = router;
