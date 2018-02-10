const router = require('express').Router();
const controller = require('../controller');

router.get('/', (req, res) => {
  res.send('hello world!');
});
router.post('/driver/enqueue', controller.addSupply);
router.post('/prices', controller.addView);
router.post('/requests', controller.addRequest);
router.get('/supplydemandlogs/:time', controller.getSDlogs);
router.get('/viewtorequestlogs/:time', controller.getVRlogs);

module.exports = router;
