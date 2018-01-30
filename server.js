'use strict';

const express = require('express');
const data = require('./db/notes');
const simDB = require('./db/simDB');
const notes = simDB.initialize(data);
const {PORT} = require('./config');
// same as const PORT = require('./config').PORT;
const {requestLogger} = require('./middleware/requestLogger');

// INSERT EXPRESS APP CODE HERE...
const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(requestLogger);

app.get('/v1/notes', (req, res, next) => {
  const {searchTerm} = req.query;

  notes.filter(searchTerm, (err, list) => {
    if (err) {
      return next(err);
    }
    res.json(list);
  });
});

app.get('/v1/notes/:id', (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  // const item = data.find(item => item.id === id);

  notes.find(id, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      return res.json({message: 'Not Found'});
    }
  });
});

app.put('/v1/notes/:id', (req, res, next) => {
  const id = parseInt(req.params.id, 10);

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateFields = ['title', 'content'];

  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  notes.update(id, updateObj, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      next();
    }
  });
});

app.get('/throw', (req, res, next) => {
  throw new Error('Boom!!');
});

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