const chai = require('chai');
const faker = require('faker');
// const request = require('supertest');
const chaiHttp = require('chai-http');
const db = require('../postgresql');
const app = require('../server/index.js');

const { expect } = chai;
const should = chai.should();
chai.use(chaiHttp);

describe('should have five working endpoints', () => {
  describe('get /supplydemandlogs', () => {
    it('should send 400 if input invalid time', (done) => {
      chai.request(app)
        .get('/supplydemandlogs/abc')
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it('should send 404 if there is no data for the time stamp', (done) => {
      chai.request(app)
        .get('/supplydemandlogs/2018-02-01 23:00:00')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('message');
          res.body.message.should.equal('Sorry! No data at this point! Try again later!');
          done();
        });
    });
    describe('for successful request', () => {
      it('should send 200 and data', (done) => {
        chai.request(app)
          .get('/supplydemandlogs/2018-02-04 23:00:00')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('time_stamp');
            res.body.should.have.property('supply');
            res.body.should.have.property('demand');
            done();
          });
      });
      it('should query sdlogs table and get 1 row of result', () => {

      });
    });
  });

  describe('get -/viewtorequestlogs', () => {
    it('should send 400 if input invalid time', (done) => {
      chai.request(app)
        .get('/viewtorequestlogs/abc')
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it('should send 404 if there is no data for the time stamp', (done) => {
      chai.request(app)
        .get('/viewtorequestlogs/2018-02-01 23:00:00')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('message');
          res.body.message.should.equal('Sorry! No data at this point! Try again later!');
          done();
        });
    });
    describe('for successful request', () => {
      it('should send 200 and data', (done) => {
        chai.request(app)
          .get('/viewtorequestlogs/2018-02-04 23:00:00')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('time_stamp');
            res.body.should.have.property('totalViews');
            res.body.should.have.property('totalRequests');
            res.body.should.have.property('averageSurge');
            done();
          });
      });
      it('should query vrlogs table and get 4 rows of results', () => {

      });
    });
  });

  describe('post -/driver/enqueue', () => {
    it('should send 401 for error', (done) => {
      chai.request(app)
        .post('/driver/enqueue')
        .end((err, res) => {
          if (err) {
            expect(res.statusCode).to.equal(401);
          }
          done();
        });
    });
    it('should send 200 when succeed', (done) => {
      chai.request(app)
        .post('/driver/enqueue')
        .send({
          driver_id: faker.random.uuid(),
          time_stamp: faker.date.between('2018-02-05', '2018-02-06'),
        })
        .end((err, res) => {
          if (!err) {
            expect(res.statusCode).to.equal(200);
          }
          done();
        });
    });
    it ('should send message to SQS supply queue', () => {

    });
    it ('should resend HTTPrequest if failed to add message to the queue', () => {

    });
  });

  describe('post -/prices', () => {
    it('should send 401 when error', (done) => {
      chai.request(app)
        .post('/prices')
        .end((err, res) => {
          if (err) {
            expect(res.statusCode).to.equal(401);
          }
          done();
        });
    });
    it('should send 200 when succeed', (done) => {
      chai.request(app)
        .post('/prices')
        .send({
          surge_id: faker.random.uuid(),
          time_stamp: faker.date.between('2018-02-05', '2018-02-06'),
          is_surged: faker.random.boolean(),
          surge_ratio: faker.random.number(9),
        })
        .end((err, res) => {
          if (!err) {
            expect(res.statusCode).to.equal(200);
          }
          done();
        });
    });
    it('should send messaage to SQS views queue', () => {

    });
    it('should resend HTTPrequest if failed to add message to SQS', () => {

    });
  });

  describe('post -/requests', () => {
    it('should send 401 when error', (done) => {
      chai.request(app)
        .post('/requests')
        .end((err, res) => {
          if (err) {
            expect(res.statusCode).to.equal(401);
          }
          done();
        });
    });
    it('should send 200 when succeed', (done) => {
      chai.request(app)
        .post('/requests')
        .send({
          request_id: faker.random.uuid(),
          time_stamp: faker.date.between('2018-02-05', '2018-02-06'),
          is_surged: faker.random.boolean(),
          surge_ratio: faker.random.number(9),
        })
        .end((err, res) => {
          if (!err) {
            expect(res.statusCode).to.equal(200);
          }
          done();
        });
    });
  });
  it('should send message to SQS requests queue', () => {

  });
  it('should resend HTTPrequest if failed to add message to the SQS', () => {

  });
});

describe('should have worker setting up to poll messages', () => {
  it('should poll message from the queue and add to database', () => {

  });
  it('should delete message if successfully write to database', () => {

  });
  it('should NOT delete message if failed to write to database', () => {

  });
});

describe('should have worker to generate reports', () => {
  it('should only work everyday after 3am', () => {

  });
  it('should read all the data from 6am- 12pm of the previous day', () => {

  });
  it('should calulate all supply counts, views counts and requests counts for every 15 mins', () => {

  });
  it('should write result to database', () => {

  });
});
