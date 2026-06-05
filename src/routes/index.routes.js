const express = require('express')
const router = express.Router();
const encargadoCentralRoutes = require('./encargadoCentral.routes');

router.use('/', encargadoCentralRoutes);

module.exports = router;