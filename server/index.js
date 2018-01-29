const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.port || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.status(200);
  res.json({message: "Hello World!"})
});

app.listen(port, () => {
  console.log (`listening to port ${port}`);
});

module.exports = app;