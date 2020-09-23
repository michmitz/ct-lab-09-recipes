const { Router } = require('express');
const Log = require('../models/log');

module.exports = Router()
  .post('/', (req, res, next) => {
    Log
      .insertLog(req.body)
      .then(log => res.send(log))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Log
      .findLog()
      .then(logs => res.send(logs))
      .catch(next);
  });

