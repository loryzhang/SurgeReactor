const express = require('express');
const app = express();
const port = process.env.port || 8000;

app.get('/', (req, res) => {
  res.send('hello world');
});

app.listen(port, () => {
  console.log (`listening to port ${port}`);
});
