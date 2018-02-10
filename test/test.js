const chai = require('chai');
const faker = require('faker');
// const request = require('supertest');
const chaiHttp = require('chai-http');
const db = require('../postgresql');
const app = require('../server/index.js');
const aws = require('../aws');

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
    it('should send 200 and data on success', (done) => {
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
    it('should send 200 and data on success', (done) => {
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
  });

  describe('post -/driver/enqueue', () => {
    const incomingMsg = {
      driver_id: faker.random.uuid(),
      time_stamp: faker.date.between('2018-02-05', '2018-02-06'),
    };
    const checkIfMessageExitInQueue = (messageId) => {
      return true;
    };

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
    it('should send 200 and send message to SQS supply queue', (done) => {
      chai.request(app)
        .post('/driver/enqueue')
        .send(incomingMsg)
        .end((err, res) => {
          if (!err) {
            expect(res.statusCode).to.equal(200);
            const { messageId } = res.body;
            const inSupplyQueue = checkIfMessageExitInQueue(messageId);
            inSupplyQueue.should.equal(true);
          }
          done();
        });
    });

    describe('should have worker setting up to poll messages', () => {
      it('should poll message from the queue and add to database', () => {
        db.connect()
          .then(client =>
            client.query(`select * from supply where time_stamp = '${incomingMsg.time_stamp}' and driver_id = '${incomingMsg.driver_id}'`)
              .then(result => result.rowCount.should.equal(1))
              .catch(e => console.log(e)));
      });
      it('should delete message if successfully write to database', () => {
        const inSupplyQueue = checkIfMessageExitInQueue();
        inSupplyQueue.should.equal(false);
      });
      it('should NOT delete message if failed to write to database', () => {
        const inSupplyQueue = checkIfMessageExitInQueue();
        inSupplyQueue.should.equal(true);
      });
    });
  });

  describe('post -/prices', () => {
    const incomingMsg = {
      surge_id: faker.random.uuid(),
      time_stamp: faker.date.between('2018-02-05', '2018-02-06'),
      is_surged: faker.random.boolean(),
      surge_ratio: faker.random.number(9),
    };
    const checkIfMessageExitInQueue = (messageId) => {
      return true;
    };

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
        .send(incomingMsg)
        .end((err, res) => {
          if (!err) {
            const { messageId } = res.body;
            const inViewsQueue = checkIfMessageExitInQueue(messageId);
            inViewsQueue.should.equal(true);
            expect(res.statusCode).to.equal(200);
          }
          done();
        });
    });
  });

  describe('post -/requests', () => {
    const incomingMsg = {
      request_id: faker.random.uuid(),
      time_stamp: faker.date.between('2018-02-05', '2018-02-06'),
      is_surged: faker.random.boolean(),
      surge_ratio: faker.random.number(9),
    };
    const checkIfMessageExitInQueue = (messageId) => {
      return true;
    };

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
        .send(incomingMsg)
        .end((err, res) => {
          if (!err) {
            const { messageId } = res.body;
            const inRequestQueue = checkIfMessageExitInQueue(messageId);
            inRequestQueue.should.equal(true);
            expect(res.statusCode).to.equal(200);
          }
          done();
        });
    });
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
    db.connect()
      .then(client => client.query()
        .then(result => result.rowCount.should.equal(1))
        .catch(e => console.log (e)));
  });
});
