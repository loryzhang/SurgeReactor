const router = require('express').Router();
const controller=require('../controller');

router.get('/loaderio-221db89cd090500c274ed7c0826eda6a', (req, res) => {
  res.send('loaderio-221db89cd090500c274ed7c0826eda6a');
});

router.get('/', (req, res) => {
  res.send('hello world!');
});
router.post('/driver/enqueue', controller.addSupply);
router.post('/prices', controller.addView);
router.post('/requests', controller.addRequest);
router.get('/supplydemandlogs/:time', controller.getSDlogs);
router.get('/viewtorequestlogs/:time', controller.getVRlogs);

module.exports = router;
