const router = require('express').Router();
const redis = require('../redis');
const awsSQS = require('../awsSQS');
const postgreSQL = require('../postgresql');

router.get('/', (req, res) => {
  res.render('index', { message1: 'Hey', message2: 'Hello there!' });
});
router.post('/driver/enqueue', awsSQS.driver.enqueue);
router.post('/driver/dequeue', awsSQS.driver.dequeue);
router.post('/rider/enqueue', awsSQS.rider.enqueue);
router.post('/rider/dequeue', awsSQS.rider.dequeue);
router.post('/prices', awsSQS.views);
router.post('/requests', awsSQS.requests);
router.get('/supplydemandlogs/:time', redis.getSDlogs);
router.get('/viewtorequestlogs/:time', redis.getVRlogs);
router.post('/addtoredis', redis.adduser);
router.get('/fake', postgreSQL.insertData);

module.exports = router;
