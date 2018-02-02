'use strict';

const app = require('../server');
const chai = require('chai');
const chaiHTTP = require('chai-http');
const chaiSpies = require('chai-spies');

const expect = chai.expect;

chai.use(chaiHTTP);
chai.use(chaiSpies);

describe('Reality check', function () {

  it('true should be true', function () {
    expect(true).to.be.true;
  });

  it('2 + 2 should equal 4', function () {
    expect(2 + 2).to.equal(4);
  });

});

describe('Express static', function () {

  it('GET request "/" should return the index page', function () {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });

});

describe('404 handler', function () {

  it('should respond with 404 when given a bad path', function () {
    const spy = chai.spy();
    return chai.request(app)
      .get('/bad/path')
      .then(spy)
      .then(() => {
        expect(spy).to.not.have.been.called();
      })
      .catch(err => {
        expect(err.response).to.have.status(404);
      });
  });

});

describe('GET /v1/notes', function () {

  it('should return 10 notes', function() {
    return chai.request(app)
      .get('/v1/notes')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.length(10);
      });
  });
  
  it('should return a list with the correct fields', function() {
    return chai.request(app)
      .get('/v1/notes')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.length(10);
        res.body.forEach(function (item) {
          expect(item).to.be.an('object');
          expect(item).to.include.keys('id', 'title', 'content');
        });
      });
  });

  it('should return correct search results for a valid query', function () {
    return chai.request(app)
      .get('/v1/notes?searchTerm=5%20life')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(1);
        expect(res.body[0]).to.be.an('object');
        expect(res.body[0].id).to.equal(1000);
      });
  });

  it('should return an empty array for an incorrect query', function () {
    return chai.request(app)
      .get('/v1/notes?searchTerm=Not%20a%20Valid%20Search')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(0);
      });
  });
});

describe('GET /v1/notes/:id', function() {

  it('should return item with correct ID', function() {
    return chai.request(app)
      .get('/v1/notes/1005')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.keys('id', 'title', 'content');
        expect(res.body.id).to.equal(1005);
      });
  });

  it('should respond with 404 error for invalid ID', function() {
    const spy = chai.spy();
    return chai.request(app)
      .get('/v1/notes/9999')
      .then(spy)
      .then(function () {
        expect(spy).to.not.have.been.called();
      })
      .catch(function (err) {
        expect(err.response).to.have.status(404);
      });
  });
});

describe('POST /v1/notes', function () {

  it('should create and return a new item', function() {
    const newItem = {
      'title': 'Title',
      'content': 'Description about Title'
    };
    return chai.request(app)
      .post('/v1/notes')
      .send(newItem)
      .then(function (res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.keys('id', 'title', 'content');
        expect(res.body.id).to.not.equal(null);
      });
  });

  it('should return error if required field is missing', function() {
    const newItem = {
      'name': 'milk'
    };
    const spy = chai.spy();
    return chai.request(app)
      .post('/v1/notes')
      .send(newItem)
      .then(spy)
      .then(function() {
        expect(spy).to.not.have.been.called();
      })
      .catch(function(err) {
        const res = err.response;
        expect(res).to.have.status(400);
        expect(res).to.have.json;
        expect(res.body).to.be.an('object');
      });
  });
});

describe('PUT /v1/notes/:id', function() {

  it('should update the note', function() {
    const updateItem = {
      'title': 'Where are the dogs?',
      'content': 'I do not know'
    };
    return chai.request(app)
      .put('/v1/notes/1005')
      .send(updateItem)
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.keys('id', 'title', 'content');
        expect(res.body.id).to.equal(1005);
        expect(res.body.title).to.equal(updateItem.title);
        expect(res.body.content).to.equal(updateItem.content);
      });
  });

  it('should respond with error', function() {
    const updateItem = {
      'title': 'Where are the dogs?',
      'content': 'I do not know'
    };
    const spy = chai.spy();
    return chai.request(app)
      .put('/v1/notes/9999')
      .send(updateItem)
      .then(spy)
      .then(function() {
        expect(spy).to.not.have.been.called();
      })
      .catch(function (err) {
        expect(err.response).to.have.status(404);
      });
  }); 
});

describe('DELETE /v1/notes/:id', function() {

  it('should delete selected note', function() {
    return chai.request(app)
      .delete('/v1/notes/1005')
      .then(function(res) {
        expect(res).to.have.status(204);
      });
  });
  
  it('should return error', function() {
    const spy = chai.spy();
    return chai.request(app)
      .delete('/v1/notes/100')
      .then(spy)
      .then(function() {
        expect(spy).to.not.have.been.called();
      })
      .catch(function(err) {
        expect(err.response).to.have.status(404);
      });
  });
});