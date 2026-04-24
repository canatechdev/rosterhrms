const router = require("express").Router();
// const profileController = require('../../controllers/employee/profile.controller.js');
const { reqBody } = require('../../middlewares/req_body.middleware.js');
const authMiddleware = require('../../middlewares/auth.middleware.js');
const upload = require("../../config/multer.config");

const path    = require('path');
const { generateTemplate, processUploadedFile } = require('../../controllers/Excel/ExcelOps.js');


router.get('/template', generateTemplate);
router.post('/upload', upload.single('file'), processUploadedFile);

module.exports = router;