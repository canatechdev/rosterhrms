// CONTROLLER
const zpController = require('../../controllers/zp/zp.controller');
const { reqBody } = require('../../middlewares/req_body.middleware');
const authMiddleware = require('../../middlewares/auth.middleware');
const router = (require('express')).Router();

// ZP CRUD
router.post('/', authMiddleware, reqBody, zpController.createZp);
router.get('/', authMiddleware, zpController.getZps);
router.get('/:id', authMiddleware, zpController.getZpById);
router.put('/:id', authMiddleware, reqBody, zpController.updateZp);
router.delete('/:id', authMiddleware, zpController.deleteZp);

// cadre crud 
router.post('/add_cadre',authMiddleware, reqBody, zpController.addCadre);
router.get('/get_cadre', authMiddleware, zpController.getCadre);
router.get('/get_cadre/:cadre_id', authMiddleware, zpController.getCadreById);
router.put('/update_cadre/:cadre_id', authMiddleware, reqBody, zpController.updateCadre);
router.delete('/delete_cadre/:cadre_id', authMiddleware, zpController.deleteCadre);

// post crud 
router.post('/add_post', authMiddleware, reqBody, zpController.addPost);
router.get('/get_post', authMiddleware, zpController.getPostByZP);
router.get('/get_post/:post_id', authMiddleware, zpController.getPostById);
router.put('/update_post/:post_id', authMiddleware, reqBody, zpController.updatePost);
router.delete('/delete_post/:post_id', authMiddleware, zpController.deletePost);

// cadre post crud
router.post('/add_cadre_post', authMiddleware, reqBody, zpController.addCadrePost);
router.get('/get_cadre_post', authMiddleware, zpController.getCadrePostByZP);
router.get('/get_cadre_post/:cadre_id', authMiddleware, zpController.getCadrePostByCadreId);
router.put('/update_cadre_post/:cadre_post_id', authMiddleware, reqBody, zpController.updateCadrePost);
router.delete('/delete_cadre_post/:cadre_post_id', authMiddleware, zpController.deleteCadrePost);

// roster templates/point crud
router.post('/add_roster_template', authMiddleware, reqBody, zpController.addRosterTemplate);
router.get('/get_roster_template', authMiddleware, zpController.getRosterTemplateByZP);
router.get('/get_roster_template/:template_id', authMiddleware, zpController.getRosterTemplateById);
router.put('/update_roster_template/:template_id', authMiddleware, reqBody, zpController.updateRosterTemplate);
router.delete('/delete_roster_template/:template_id', authMiddleware, zpController.deleteRosterTemplate);

// roster genaration 
router.post("/generate-roster/:cadre_post_id", zpController.generateRoster);
router.post("/create-vacancy/:cadre_post_id", zpController.createVacancy);
router.post("/fill-vacancy/:vacancy_id", zpController.fillVacancy);



module.exports = router;
