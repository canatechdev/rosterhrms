const router = (require('express')).Router();
const roleController = require('../../controllers/system/role.controller.js');
const { reqBody } = require('../../middlewares/req_body.middleware.js');
const authMiddleware = require('../../middlewares/auth.middleware.js');

router.post('/', authMiddleware, reqBody, roleController.createRole);
router.get('/', authMiddleware, roleController.getRoles);
router.get('/:id', authMiddleware, roleController.getRoleById);
router.put('/:id', authMiddleware, reqBody, roleController.updateRole);
router.delete('/:id', authMiddleware, roleController.deleteRole);

module.exports = router;
