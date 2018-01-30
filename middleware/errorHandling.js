'use strict';

function errorHandling(req, res, next) {
  var err = new Error('Not found');
  err.status = 404;
  res.status(404).json({message: 'Not found'});
}

function errorHandling2(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
}

module.exports = {errorHandling};
module.exports = {errorHandling2};