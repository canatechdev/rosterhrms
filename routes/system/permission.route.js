const router = (require('express')).Router();
const permissionController = require('../../controllers/system/permission.controller.js');
const { reqBody } = require('../../middlewares/req_body.middleware.js');
const authMiddleware = require('../../middlewares/auth.middleware.js');

router.post('/', authMiddleware, reqBody, permissionController.createPermission);
router.get('/', authMiddleware, permissionController.getPermissions);
router.get('/:id', authMiddleware, permissionController.getPermissionById);
// router.get('/:role_id', authMiddleware, permissionController.getPermissionByRoleId);
router.put('/:id', authMiddleware, reqBody, permissionController.updatePermission);
// router.delete('/:id', authMiddleware, permissionController.deletePermission);



module.exports = router;
