const router = (require('express')).Router();
const casteController = require('../../controllers/system/caste.controller.js');
const { reqBody } = require('../../middlewares/req_body.middleware.js');
const authMiddleware = require('../../middlewares/auth.middleware.js');

router.post('/', authMiddleware, reqBody, casteController.createCaste);
router.get('/', authMiddleware, casteController.getCastes);
router.get('/:id', authMiddleware, casteController.getCasteById);
router.put('/:id', authMiddleware, reqBody, casteController.updateCaste);
router.delete('/:id', authMiddleware, casteController.deleteCaste);

module.exports = router;
