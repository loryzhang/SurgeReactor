const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const pug = require('pug');
const methodOverride = require('method-override');
const morgan = require('morgan');
const redis = require('redis');
// const session = require('express-session');
// const RedisStore = require('connect-redis')(session);
const client = redis.createClient();
client.on('connect', () => {
  console.log('connected to Redis...');
});

const app = express();
const port = process.env.port || 8000;
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../views'));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
  res.render('index', { message1: 'Hey', message2: 'Hello there!' });
});

app.post('/add', (req, res) => {
  const { id, name } = req.body;
  client.hset('user', 'id', id, redis.print);
  client.hset(['user', 'name', name], redis.print);
  client.hkeys('user', (err, replies) => {
    console.log(`${replies.length}replies: `);
    replies.forEach((reply, i) => {
      console.log(`${i} : ${reply}`);
    });
  });
  res.render('index', { message1: id, message2: name });
});

app.listen(port, () => {
  console.log (`listening to port ${port}`);
});

module.exports = app;