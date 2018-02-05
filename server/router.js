const router = require('express').Router();
const redis = require('../redis');
const SQS = require('../SQS');
const postgreSQL = require('../postgresql');

router.get('/', (req, res) => {
  res.render('index', { message1: 'Hey', message2: 'Hello there!' });
});
router.post('/driver/enqueue', SQS.addSupply);
// router.post('/rider/enqueue', SQS.addDemand);
router.post('/prices', SQS.addview);
router.post('/requests', SQS.addrequest);
router.get('/supplydemandlogs/:time', redis.getSDlogs);
router.get('/viewtorequestlogs/:time', redis.getVRlogs);
router.post('/addtoredis', redis.adduser);
router.get('/fake', postgreSQL.insertData);
router.get('/testquery', postgreSQL.queryData);
router.get('/addsupply', postgreSQL.addSupplyData);
router.get('/reducesupply', postgreSQL.reduceSupplyData);

module.exports = router;
