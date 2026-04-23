const router = (require('express')).Router();
const cadreController = require('../../controllers/system/cadre.controller.js');
const { reqBody } = require('../../middlewares/req_body.middleware.js');
const authMiddleware = require('../../middlewares/auth.middleware.js');

// router.post('/', authMiddleware, reqBody, cadreController.createcadre);
// router.get('/', authMiddleware, cadreController.getCadres);
// router.get('/:id', authMiddleware, cadreController.getCadreById);
// router.put('/:id', authMiddleware, reqBody, cadreController.updateCadre);
// router.delete('/:id', authMiddleware, cadreController.deleteCadre);

module.exports = router;
