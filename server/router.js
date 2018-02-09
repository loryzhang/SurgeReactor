const router = require('express').Router();
// const redis = require('../redis');
const SQS = require('../SQS');
const test = require('../postgresql/testSupply.js');
const endPointQuery = require('../postgresql/endpointQuery.js');
// const dbTest = require('../postgresql/testingQueries');

router.get('/', (req, res) => {
  res.send('hello world!');
});
router.post('/driver/enqueue', test);
router.post('/prices', SQS.addView);
router.post('/requests', SQS.addRequest);
router.get('/supplydemandlogs/:time', endPointQuery.getSDlogs);
router.get('/viewtorequestlogs/:time', endPointQuery.getVRlogs);
// router.post('/addtoredis', redis.adduser);
// router.get('/fake', dbTest.insertData);

module.exports = router;
