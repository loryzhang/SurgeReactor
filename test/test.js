const chai = require('chai');
const request = require('supertest');

const { expect } = chai;
const app = require('../server/index.js');

describe('should set up some routing', () => {
  it('should have route for get /', (done) => {
    request(app)
      .get('/')
      .end((err, res) => {
        if (err) {
          expect(res.statusCode).to.equal(404);
        } else {
          expect(res.statusCode).to.equal(200);
        }
        done();
      });
  });

  it('should have route for get /supplydemandlogs', (done) => {
    request(app)
      .get('/supplydemandlogs/time:2018-01-25T18:25:43.511Z')
      .end((err, res) => {
        if (err) {
          expect(res.statusCode).to.equal(404);
        } else {
          expect(res.statusCode).to.equal(200);
        }
        done();
      });
  });

  it('should have route for get /viewtorequestlogs', (done) => {
    request(app)
      .get('/viewtorequestlogs/time:2018-01-25T18:25:43.511Z')
      .end((err, res) => {
        if (err) {
          expect(res.statusCode).to.equal(404);
        } else {
          expect(res.statusCode).to.equal(200);
        }
        done();
      });
  });

  it('should have route for post /add', (done) => {
    request(app)
      .post('/addtoredis')
      .send({ id: '009', name: 'abc' })
      .end((err, res) => {
        if (err) {
          expect(res.statusCode).to.equal(401);
        } else {
          expect(res.statusCode).to.equal(200);
        }
        done();
      });
  });

  it('should have route for post /driver/enqueue', (done) => {
    request(app)
      .post('/driver/enqueue')
      .send({
        driver_id: '000000001',
        time_stamp: '2018-01-25T18:25:43.511Z',
        locations: {
          longitude: -122.425844,
          latitude: 37.775657,
        },
      })
      .end((err, res) => {
        if (err) {
          expect(res.statusCode).to.equal(401);
        } else {
          expect(res.statusCode).to.equal(200);
        }
        done();
      });
  });

  it('should have route for post /driver/dequeue', (done) => {
    request(app)
      .post('/driver/dequeue')
      .send({
        driver_id: '000000001',
        time_stamp: '2018-01-25T18:25:43.511Z',
      })
      .end((err, res) => {
        if (err) {
          expect(res.statusCode).to.equal(401);
        } else {
          expect(res.statusCode).to.equal(200);
        }
        done();
      });
  });

  it('should have route for post /rider/enqueue', (done) => {
    request(app)
      .post('/rider/enqueue')
      .send({
        rider_id: '000000002',
        time_stamp: '2018-01-25T18:25:43.511Z',
        locations: {
          longitude: -122.425844,
          latitude: 37.775657,
        },
      })
      .end((err, res) => {
        if (err) {
          expect(res.statusCode).to.equal(401);
        } else {
          expect(res.statusCode).to.equal(200);
        }
        done();
      });
  });

  it('should have route for post /rider/dequeue', (done) => {
    request(app)
      .post('/rider/dequeue')
      .send({
        rider_id: '000000002',
        time_stamp: '2018-01-25T18:25:43.511Z',
      })
      .end((err, res) => {
        if (err) {
          expect(res.statusCode).to.equal(401);
        } else {
          expect(res.statusCode).to.equal(200);
        }
        done();
      });
  });

  it('should have route for post /prices', (done) => {
    request(app)
      .post('/prices')
      .send({
        rider_id: '000000002',
        time_stamp: '2018-01-25T18:25:43.511Z',
        is_surged: true,
        surge_ratio: 1,
      })
      .end((err, res) => {
        if (err) {
          expect(res.statusCode).to.equal(401);
        } else {
          expect(res.statusCode).to.equal(200);
        }
        done();
      });
  });

  it('should have route for post /requests', (done) => {
    request(app)
      .post('/requests')
      .send({
        request_id: '000000010',
        time_stamp: '2018-01-25T18:25:43.511Z',
        is_surged: true,
        surge_ratio: 1,
      })
      .end((err, res) => {
        if (err) {
          expect(res.statusCode).to.equal(401);
        } else {
          expect(res.statusCode).to.equal(200);
        }
        done();
      });
  });
});
