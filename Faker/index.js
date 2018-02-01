const faker = require('faker');
const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-west-2',
  endpoint: 'http://localhost:8000',
});

const tableName = 'supply';
const dynamo = new AWS.DynamoDB();
const documentClient = new AWS.DynamoDB.DocumentClient();
const params = {
  TableName: tableName,
  KeySchema: [
    { AttributeName: 'hashkey', KeyType: 'HASH' },
    { AttributeName: 'timestamp', KeyType: 'RANGE' },
  ],
  AttributeDefinitions: [
    { AttributeName: 'hashkey', AttributeType: 'S' },
    { AttributeName: 'timestamp', AttributeType: 'S' },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 25,
    WriteCapacityUnits: 25,
  },
};
dynamo.createTable(params, (tableErr, tableData) => {
  if (tableErr) {
    console.error('Error JSON:', JSON.stringify(tableErr, null, 2));
  } else {
    console.log('Created table successfully!', tableData);
  }
});

module.exports = {
  generateDataFromDriver: (req, res) => {
    const driverid = faker.random.uuid();
    const timestamp = faker.date.between('2017-11-01', '2018-01-31');
    console.log (`${driverid}${timestamp}`);
    const message = {
      TableName: tableName,
      Item: {
        'hashkey': `${driverid}${timestamp}`,
        'timestamp': JSON.stringify(timestamp),
        'driverid': driverid,
      },
    };
    console.log('Adding a new item...');
    documentClient.put(message, (err, data) => {
      if (err) {
        console.error('Error JSON:', JSON.stringify(err, null, 2));
      } else {
        console.log('Added item successfully!', data);
      }
    });
    const query = {
      TableName: tableName,
      Key: {
        'hashkey': `${driverid}${timestamp}`,
        'timestamp': JSON.stringify(timestamp),
      },
    };
    documentClient.get(query, (err, data) => {
      if (err) {
        console.error('Error JSON:', JSON.stringify(err, null, 2));
        res.end();
      } else {
        console.log('Added item successfully!');
        res.json(data);
      }
    });
  },
  generateDataFromSurge: () => {

  },
  generateDataFromMatch: () => {

  },
};
