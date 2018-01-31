'use strict';

const express = require('express');
const morgan = require('morgan');

const app = express();

const notesRouter = require('./router/notes.router');

const {PORT} = require('./config');
// same as const PORT = require('./config').PORT;
// const {requestLogger} = require('./middleware/requestLogger');

// INSERT EXPRESS APP CODE HERE...
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static('public'));
app.use('/v1', notesRouter);


// app.get('/throw', (req, res, next) => {
//   throw new Error('Boom!!');
// });

app.use(function (req, res, next) {
  var err = new Error('Not found');
  err.status = 404;
  res.status(404).json({message: 'Not found'});
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

app.listen(PORT, function() {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});