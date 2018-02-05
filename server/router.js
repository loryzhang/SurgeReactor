const router = require('express').Router();
const redis = require('../redis');
const SQS = require('../SQS');
const dbTest = require('../postgresql/testingQueries');

router.get('/', (req, res) => {
  res.render('index', { message1: 'Hey', message2: 'Hello there!' });
});
router.post('/driver/enqueue', SQS.addSupply);
router.post('/prices', SQS.addview);
router.post('/requests', SQS.addrequest);
router.get('/supplydemandlogs/:time', redis.getSDlogs);
router.get('/viewtorequestlogs/:time', redis.getVRlogs);
router.post('/addtoredis', redis.adduser);
router.get('/fake', dbTest.insertData);
router.get('/testquery', dbTest.queryData);
router.get('/addsupply', dbTest.addSupplyData);
router.get('/reducesupply', dbTest.reduceSupplyData);

module.exports = router;
