// const AWS = require('aws-sdk');
const generateDataFromDriver = require('./generateDataFromDriver');
const generateDataFromSurge = require('./generateDataFromSurge');
const generateDataFromMatch = require('./generateDataFromMatch');

// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: 'us-west-2',
//   endpoint: 'http://localhost:8000',
// });

// const tableName = 'prices';
// const dynamo = new AWS.DynamoDB();

// const params = {
//   TableName: tableName,
// };

// dynamo.deleteTable(params, (tableErr, tableData) => {
//   if (tableErr) {
//     console.error('Error JSON:', JSON.stringify(tableErr, null, 2));
//   } else {
//     console.log('Created table successfully!', tableData);
//   }
// });

module.exports = {
  generateDataFromDriver,
  generateDataFromSurge,
  generateDataFromMatch,
};
