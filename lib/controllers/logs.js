const { Router } = require('express');
const Log = require('../models/log');

// eslint-disable-next-line new-cap
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
  })

  .get('/:id', (req, res, next) => {
    Log
      .findLogById(req.params.id)
      .then(log => res.send(log))
      .catch(next);
  })

  .put('/:id', (req, res, next) => {
    Log
      .updateLog(req.params.id, req.body)
      .then(log => res.send(log))
      .catch(next);
  });

  
