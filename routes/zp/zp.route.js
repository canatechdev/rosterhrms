// CONTROLLER
const zpController = require('../../controllers/zp/zp.controller');
const { reqBody } = require('../../middlewares/req_body.middleware');
const authMiddleware = require('../../middlewares/auth.middleware');
const router = (require('express')).Router();

// ZP CRUD
router.post('/add_zp', authMiddleware, reqBody, zpController.createZp);
router.get('/get_all_zps', authMiddleware, zpController.getZps);
router.get('/get_zp/:id', authMiddleware, zpController.getZpById);
router.put('/update_zp/:id', authMiddleware, reqBody, zpController.updateZp);
router.delete('/delete_zp/:id', authMiddleware, zpController.deleteZp);

// department crud 
router.post('/add_department',authMiddleware,reqBody,zpController.addDepartment);
router.get("/get_department",authMiddleware,zpController.getDepartmentByZP);
router.get('/get_department/:id',authMiddleware,zpController.getDepartmentById);
router.put('/update_department/:id',authMiddleware,reqBody,zpController.updateDepartment);
router.delete('/delete_department/:id',authMiddleware,zpController.deleteDepartment);
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

// roster generation 
router.post('/generate-roster',authMiddleware, zpController.generateRosterByZP);
router.post("/create-vacancy", authMiddleware, zpController.createVacancyByZP);
router.post("/fill-vacancy/:vacancy_id", authMiddleware, zpController.fillVacancy);
// manage employee movements
router.post("/retire-employee/:user_id", authMiddleware, zpController.retireEmployee);
router.post("/promote-employee",authMiddleware,reqBody,zpController.promoteEmployee);
router.post("/transfer-employee/:user_id",authMiddleware,reqBody,zpController.transferEmployee);



module.exports = router;
