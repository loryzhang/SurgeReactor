const chai = require('chai');
const faker = require('faker');
// const request = require('supertest');
const chaiHttp = require('chai-http');

const { expect } = chai;
const should = chai.should();
const app = require('../server/index.js');

chai.use(chaiHttp);

describe('should have route for get/', () => {
  it('should send 404 when error', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        if(err) {
          res.should.have.status(404);
        }
        done();
      });
  });

  it('status code should be 200 if succeed', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

describe('should have route for get /supplydemandlogs', () => {
  it('should send 400 if error', (done) => {
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
  it('should send 200 if succeed and should send back data', (done) => {
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

describe('should have route for get /viewtorequestlogs', () => {
  it('should send 400 if error', (done) => {
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
  it('should send 200 if succeed and should send back data', (done) => {
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

describe('should have route for post /driver/enqueue', () => {
  it('should send 401 when error', (done) => {
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
});

describe('should have route for post/prices', () => {
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
});

describe('should have route for post /requests', () => {
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
