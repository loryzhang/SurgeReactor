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
      time_stamp: faker.date.between('2018-02-06', '2018-02-07'),
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
    xit('should send 200 and send message to SQS supply queue', (done) => {
      chai.request(app)
        .post('/driver/enqueue')
        .send(incomingMsg)
        .end((err, res) => {
          if (!err) {
            const { messageId } = res.body;
            const params = {
              QueueUrl: `${process.env.sqs}addSupply.fifo`,
              MaxNumberOfMessages: 10,
              VisibilityTimeout: 0,
              WaitTimeSeconds: 0,
            };
            aws.receiveMessage(params, (e, data) => {
              if (e) {
                throw e;
              } else {
                data.Messages.pop().MessageId.should.equal(messageId);
              }
            });
            expect(res.statusCode).to.equal(200);
          }
          done();
        });
    });

    it('should poll message from the queue and add to database', () => {
      const query = `select * from supply where time_stamp = '${incomingMsg.time_stamp.toISOString()}' and driver_id = '${incomingMsg.driver_id}'`;
      chai.request(app)
        .post('/prices')
        .send(incomingMsg)
        .end((err, res) => {
          if (!err) {
            db.connect()
              .then(client =>
                client.query(query)
                  .then((result) => {
                    client.release();
                    result.rowCount.should.equal(1);
                  })
                  .catch((e) => {
                    client.release();
                    console.log(e);
                  }));
            expect(res.statusCode).to.equal(200);
          }
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
    xit('should send 200 and send message to SQS views queue', (done) => {
      chai.request(app)
        .post('/prices')
        .send(incomingMsg)
        .end((err, res) => {
          if (!err) {
            const { messageId } = res.body;
            const params = {
              QueueUrl: `${process.env.sqs}views.fifo`,
              MaxNumberOfMessages: 10,
              VisibilityTimeout: 0,
              WaitTimeSeconds: 0,
            };
            aws.receiveMessage(params, (e, data) => {
              if (e) {
                throw e;
              } else {
                data.Messages.pop().MessageId.should.equal(messageId);
              }
            });
            expect(res.statusCode).to.equal(200);
          }
          done();
        });
    });

    it('should poll message from the queue and add to database', () => {
      const query = `select * from views where time_stamp = '${incomingMsg.time_stamp.toISOString()}' and surge_id = '${incomingMsg.surge_id}'`;
      console.log(query);
      chai.request(app)
        .post('/prices')
        .send(incomingMsg)
        .end((err, res) => {
          if (!err) {
            db.connect()
              .then(client =>
                client.query(query)
                  .then((result) => {
                    client.release();
                    result.rowCount.should.equal(1);
                  })
                  .catch((e) => {
                    console.log(e);
                  }));
            expect(res.statusCode).to.equal(200);
          }
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
    xit('should send 200 and send message to SQS requests queue', (done) => {
      chai.request(app)
        .post('/requests')
        .send(incomingMsg)
        .end((err, res) => {
          if (!err) {
            const { messageId } = res.body;
            const params = {
              QueueUrl: `${process.env.sqs}requests.fifo`,
              MaxNumberOfMessages: 10,
              VisibilityTimeout: 0,
              WaitTimeSeconds: 0,
            };
            aws.receiveMessage(params, (e, data) => {
              if (e) {
                throw e;
              } else {
                data.Messages.pop().MessageID.should.equal(messageId);
              }
            });
            expect(res.statusCode).to.equal(200);
          }
          done();
        });
    });

    it('should poll message from the queue and add to database', () => {
      const query = `select * from requests where time_stamp = '${incomingMsg.time_stamp.toISOString()}' and request_id = '${incomingMsg.request_id}'`;
      chai.request(app)
        .post('/prices')
        .send(incomingMsg)
        .end((err, res) => {
          if (!err) {
            db.connect()
              .then(client =>
                client.query(query)
                  .then((result) => {
                    client.release();
                    result.rowCount.should.equal(1);
                  })
                  .catch((e) => {
                    client.release();
                    console.log(e);
                  }));
            expect(res.statusCode).to.equal(200);
          }
        });
    });
  });
});

// describe('should have worker to generate reports', () => {
//   it('should only work everyday after 3am', () => {

//   });
//   it('should read all the data from 6am- 12pm of the previous day', () => {

//   });
//   it('should calulate all supply counts, views counts and requests counts for every 15 mins', () => {

//   });
//   it('should write result to database', () => {
//     db.connect()
//       .then(client => client.query()
//         .then(result => result.rowCount.should.equal(1))
//         .catch(e => console.log (e)));
//   });
// });
