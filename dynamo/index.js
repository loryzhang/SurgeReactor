const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-west-2',
  endpoint: 'http://localhost:8000',
});

const dynamo = new AWS.DynamoDB();

const params = {
  TableName: 'supply',
};

dynamo.createTable(params, (tableErr, tableData) => {
  if (tableErr) {
    console.error('Error JSON:', JSON.stringify(tableErr, null, 2));
  } else {
    console.log('Created table successfully!', tableData);
  }
});
