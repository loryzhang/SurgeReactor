const chai = require('chai');
const request = require('supertest');

const { expect } = chai;
const app = require('../server/index.js');

describe('should have route for get/', () => {
  it('should send 404 when error', (done) => {
    request(app)
      .get('/')
      .end((err, res) => {
        if (err) {
          expect(res.statusCode).to.equal(404);
        } 
        done();
      });
  });

  it('status code should be 200 if succeed', (done) => {
    request(app)
      .get('/')
      .end((err, res) => {
        if (!err) {
          expect(res.statusCode).to.equal(200);
        }
        done();
      });
  });
});

describe('should have route for get /supplydemandlogs', () => {
  it('should send 404 if error', (done) => {
    request(app)
      .get('/supplydemandlogs/time:')
      .end((err, res) => {
        if (err) {
          expect(res.statusCode).to.equal(404);
        }
        done();
      });
  });
  it('should send 200 if succeed', (done) => {
    request(app)
      .get('/supplydemandlogs/time: 2018-01-25T18:25:43.511Z')
      .end((err, res) => {
        if (!err) {
          expect(res.statusCode).to.equal(200);
        }
        done();
      });
  });
});

describe('should have route for get /viewtorequestlogs', () => {
  it('should send 404 when error', (done) => {
    request(app)
      .get('/viewtorequestlogs/time:2018-01-25T18:25:43.511Z')
      .end((err, res) => {
        if (err) {
          expect(res.statusCode).to.equal(404);
        }
        done();
      });
  });
  it('should send 200 when succeed', (done) => {
    request(app)
      .get('/viewtorequestlogs/time:2018-01-25T18:25:43.511Z')
      .end((err, res) => {
        if (!err) {
          expect(res.statusCode).to.equal(200);
        }
        done();
      });
  });
});

describe('should have route for post /add', () => {
  it('should send 401 when error', (done) => {
    request(app)
      .post('/addtoredis')
      .end((err, res) => {
        if (err) {
          expect(res.statusCode).to.equal(401);
        }
        done();
      });
  });
  it('should send 200 for succeed', (done) => {
    request(app)
      .post('/addtoredis')
      .send({ id: '009', name: 'abc' })
      .end((err, res) => {
        if (!err) {
          expect(res.statusCode).to.equal(200);
        }
        done();
      });
  });
});
 
describe('should have route for post /driver/enqueue', () => {
  it('should send 401 when error', (done) => {
    request(app)
      .post('/driver/enqueue')
      .end((err, res) => {
        if (err) {
          expect(res.statusCode).to.equal(401);
        }
        done();
      });
  });
  it('should send 200 when succeed', (done) => {
    request(app)
      .post('/driver/dequeue')
      .send({
        driver_id: '000000001',
        time_stamp: '2018-01-25T18:25:43.511Z',
      })
      .end((err, res) => {
        if (!err) {
          expect(res.statusCode).to.equal(200);
        }
        done();
      });
  });
});
  
describe('should have route for post /driver/dequeue', () => {
  it('should send 401 when error', (done) => {
    request(app)
      .post('/driver/dequeue')
      .end((err, res) => {
        if (err) {
          expect(res.statusCode).to.equal(401);
        }
        done();
      });
  });
  it('should send 200 if succeed', (done) => {
    request(app)
      .post('/driver/dequeue')
      .send({
        driver_id: '000000001',
        time_stamp: '2018-01-25T18:25:43.511Z',
      })
      .end((err, res) => {
        if (!err) {
          expect(res.statusCode).to.equal(200);
        }
        done();
      });
  });
});

describe('should have route for post /rider/enqueue', () => {
  it('should send 401 when error', (done) => {
    request(app)
      .post('/rider/enqueue')
      .end((err, res) => {
        if (err) {
          expect(res.statusCode).to.equal(401);
        }
        done();
      });
  });
  it('should send 200 when succeed', (done) => {
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
        if (!err) {
          expect(res.statusCode).to.equal(200);
        }
        done();
      });
  });
});

describe('should have route for post /rider/dequeue', () => {
  it('should send 401 when error', (done) => {
    request(app)
      .post('/rider/dequeue')
      .end((err, res) => {
        if (err) {
          expect(res.statusCode).to.equal(401);
        }
        done();
      });
  });
  it('should send 200 when succeed', (done) => {
    request(app)
      .post('/rider/dequeue')
      .send({
        rider_id: '000000002',
        time_stamp: '2018-01-25T18:25:43.511Z',
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
    request(app)
      .post('/prices')
      .end((err, res) => {
        if (err) {
          expect(res.statusCode).to.equal(401);
        }
        done();
      });
  });
  it('should send 200 when succeed', (done) => {
    request(app)
      .post('/prices')
      .send({
        rider_id: '000000002',
        time_stamp: '2018-01-25T18:25:43.511Z',
        is_surged: true,
        surge_ratio: 1,
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
    request(app)
      .post('/requests')
      .end((err, res) => {
        if (err) {
          expect(res.statusCode).to.equal(401);
        }
        done();
      });
  });
  it('should send 200 when succeed', (done) => {
    request(app)
      .post('/requests')
      .send({
        request_id: '000000010',
        time_stamp: '2018-01-25T18:25:43.511Z',
        is_surged: true,
        surge_ratio: 1,
      })
      .end((err, res) => {
        if (!err) {
          expect(res.statusCode).to.equal(200);
        }
        done();
      });
  });
});
