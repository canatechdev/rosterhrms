// CONTROLLER
const zpController = require('../../controllers/zp/zp.controller');
const { reqBody } = require('../../middlewares/req_body.middleware');

const router = (require('express')).Router();

router.post('/', (req, res) => {
    res.json({ message: "ZP route is working" });
});


module.exports = router;
