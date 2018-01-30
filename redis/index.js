const redis = require('redis');

const redisClient = redis.createClient();
redisClient.on('connect', () => {
  console.log('connected to Redis...');
});

module.exports = {
  adduser: (req, res) => {
    const { id, name } = req.body;
    redisClient.hset('user', 'id', id, redis.print);
    redisClient.hset(['user', 'name', name], redis.print);
    redisClient.hkeys('user', (err, replies) => {
      console.log(`${replies.length}replies: `);
      replies.forEach((reply, i) => {
        console.log(`${i} : ${reply}`);
      });
    });
    res.render('user', { message1: id, message2: name });
  },
  getSDlogs: (req, res) => {

  },
  getVRlogs: (req, res) => {

  },
};
