const router = (require('express')).Router();
const binduController = require('../../controllers/system/bindu.controller.js');
const { reqBody } = require('../../middlewares/req_body.middleware.js');
const authMiddleware = require('../../middlewares/auth.middleware.js');

router.post('/', authMiddleware, reqBody, binduController.createBinduPoint);
router.get('/', authMiddleware, binduController.getBinduPoints);
router.get('/:id', authMiddleware, binduController.getBinduPointById);
router.put('/:id', authMiddleware, reqBody, binduController.updateBinduPoint);
router.delete('/:id', authMiddleware, binduController.deleteBinduPoint);

module.exports = router;