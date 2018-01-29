const chai = require('chai');
const request = require('supertest');
const app = require('../server/index.js');
const expect = chai.expect;

describe('should get/', () => {
  it('should get 200 status code', function(done) { 
    request(app)
      .get('/')
      .end((err, res) => { 
        expect(res.statusCode).to.equal(200); 
        expect(res.body).to.be.an('object');
        done(); 
      });
    });
});