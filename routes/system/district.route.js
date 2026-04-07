const router = (require('express')).Router();
const districtController = require('../../controllers/system/district.controller.js');
const { reqBody } = require('../../middlewares/req_body.middleware.js');
const authMiddleware = require('../../middlewares/auth.middleware.js');

router.post('/', authMiddleware, reqBody, districtController.createDistrict);
router.get('/', authMiddleware, districtController.getDistricts);
router.get('/:id', authMiddleware, districtController.getDistrictById);
router.put('/:id', authMiddleware, reqBody, districtController.updateDistrict);
router.delete('/:id', authMiddleware, districtController.deleteDistrict);

module.exports = router;
