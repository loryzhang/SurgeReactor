const faker = require('faker');
const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-west-2',
  endpoint: 'http://localhost:8000',
});

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports = (req, res) => {
  const start = new Date();
  const params = {
    RequestItems: { /* required */
      'supply': [],
    },
    // ReturnConsumedCapacity: total,
    // ReturnItemCollectionMetrics,
  };
  for (let i = 0; i < 25; i += 1) {
    const driverid = faker.random.uuid();
    const timestamp = JSON.parse(JSON.stringify(faker.date.between('2017-11-01', '2018-01-31')));
    const putRequest = {
      PutRequest: {
        Item: {
          'hashkey': `${driverid}${timestamp}`,
          'timestamp': timestamp,
          'driverid': driverid,
        },
      },
    };
    params.RequestItems.supply.push(putRequest);
  }
  console.log('Adding a BATCH of items...');
  documentClient.batchWrite(params, (err, data) => {
    if (err) {
      console.log(err, err.stack); // an error occurred
    } else {
      const costTime = new Date() - start;
      console.log (costTime);
      res.send(data);
    }
  });
  // documentClient.put(message, (err, data) => {
  //   if (err) {
  //     console.error('Error JSON:', JSON.stringify(err, null, 2));
  //   } else {
  //     console.log('Added item successfully!', data);
  //   }
  // });
  // const query = {
  //   TableName: 'supply',
  //   Key: {
  //     'hashkey': `${driverid}${timestamp}`,
  //     'timestamp': timestamp,
  //   },
  // };
  // documentClient.get(query, (err, data) => {
  //   if (err) {
  //     console.error('Error JSON:', JSON.stringify(err, null, 2));
  //     res.end();
  //   } else {
  //     console.log('find!', data);
  //     res.send(data);
  //   }
  // });
};
