'use strict';
exports.__esModule = true;
var express_1 = require('express');
var sample_1 = require('../controllers/sample');
var router = express_1.Router();
router.get('/', function(_req, res, _next) {
  var message = sample_1['default']();
  res.status(200).json({ message: message });
});
exports['default'] = router;
