'use strict';

const express = require('express');
const data = require('./db/notes');

console.log('hello world!');

// INSERT EXPRESS APP CODE HERE...
const app = express();
app.use(express.static('public'));

app.get('/v1/notes', (req, res) => {
  const searchTerm = req.query.searchTerm;
  let items = data;
  if (searchTerm) {
    items = data.filter(item => item.title.includes(searchTerm));
  }
  res.json(items);
});

app.get('/v1/notes/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const item = data.find(item => item.id === id);
  res.json(item);
});

app.listen(8080, function() {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});