const router = require('express').Router();
const SQS = require('../SQS');
const endPointQuery = require('../postgresql/endpointQuery.js');

router.get('/', (req, res) => {
  res.send('hello world!');
});
router.post('/driver/enqueue', SQS.addSupply);
router.post('/prices', SQS.addView);
router.post('/requests', SQS.addRequest);
router.get('/supplydemandlogs/:time', endPointQuery.getSDlogs);
router.get('/viewtorequestlogs/:time', endPointQuery.getVRlogs);

module.exports = router;
