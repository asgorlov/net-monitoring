const express = require('express');
const router = express.Router();
const { homePage, getConfig, changeConfig, clearConfig, pingHosts, replaceConfig } = require('../controllers/main.controller')

router.get('/', homePage);

router.get('/config', getConfig);
router.put('/config', replaceConfig);
router.patch('/config', changeConfig);
router.delete('/config', clearConfig);

router.post('/ping', pingHosts);

module.exports = router;
