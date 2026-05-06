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

// add zp under offices 
router.post('/add_zp_under_office', authMiddleware, reqBody, zpController.addZpUnderOffice);
router.get('/get_zp_under_office', authMiddleware, zpController.getZpUnderOffice);
router.get('/get_zp_under_office/:office_id', authMiddleware, zpController.getZpUnderOfficeById);
router.put('/update_zp_under_office/:office_id', authMiddleware, reqBody, zpController.updateZpUnderOffice);
router.delete('/delete_zp_under_office/:office_id', authMiddleware, zpController.deleteZpUnderOffice);
    
// department crud 
router.post('/add_department',authMiddleware,reqBody,zpController.addDepartment);
router.get("/get_department",authMiddleware,zpController.getDepartmentByZP);
router.get('/get_department/:id',authMiddleware,zpController.getDepartmentById);
router.put('/update_department/:id',authMiddleware,reqBody,zpController.updateDepartment);
router.delete('/delete_department/:id',authMiddleware,zpController.deleteDepartment);

// salutations crud operations 
router.post("/add_salutation", authMiddleware, reqBody, zpController.addSalutation);
router.get("/get_salutation", authMiddleware, zpController.getSalutations);
router.get("/get_salutation/:enum_id", authMiddleware, zpController.getSalutationById);
router.put("/update_salutation/:enum_id", authMiddleware, reqBody, zpController.updateSalutation);
router.delete("/delete_salutation/:enum_id", authMiddleware, zpController.deleteSalutation);
 
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

// headquarters crud
router.post('/add_headquarter', authMiddleware, reqBody, zpController.addHeadquarter);
router.get('/get_headquarter', authMiddleware, zpController.getHeadquarterByZP);
router.get('/get_headquarter/:headquarter_id', authMiddleware, zpController.getHeadquarterById);
router.put('/update_headquarter/:headquarter_id', authMiddleware, reqBody, zpController.updateHeadquarter);
router.delete('/delete_headquarter/:headquarter_id', authMiddleware, zpController.deleteHeadquarter);

// blocks crud 
router.post('/add_block', authMiddleware, reqBody, zpController.addBlock);
router.get('/get_block', authMiddleware, zpController.getBlockByZP);
router.get('/get_block/:block_id', authMiddleware, zpController.getBlockById);
router.put('/update_block/:block_id', authMiddleware, reqBody, zpController.updateBlock);
router.delete('/delete_block/:block_id', authMiddleware, zpController.deleteBlock);
    
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
router.get("/get_roster_cadre_post/:cadre_post_id",authMiddleware,zpController.getRosterByCadrePost);
// manage employee movements
router.post("/retire-employee/:user_id", authMiddleware, zpController.retireAllZPsEmployees);
router.post("/promote-employee",authMiddleware,reqBody,zpController.promoteEmployee);
router.post("/transfer-employee/:user_id",authMiddleware,reqBody,zpController.transferEmployee);



module.exports = router;
