const express = require('express');
const router = express.Router();
const { homePage, getConfig, clearConfig, pingHosts, replaceConfig } = require('../controllers/main.controller')

router.get('/', homePage);

router.get('/config', getConfig);
router.put('/config', replaceConfig);
router.delete('/config', clearConfig);

router.post('/ping', pingHosts);

module.exports = router;
