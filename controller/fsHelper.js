const fs = require('fs');
const sqs = require('../aws');

module.exports = {
  handleError: (queueName, container) => {
    fs.readFile(`./${queueName}.txt`, 'utf8', (error, data) => {
      if (error) {
        return;
      }
      let entries = data.trim().split('\n');
      entries = entries.map(entry => JSON.parse(entry));
      let i = 0;
      let j = 10;
      while (i < entries.length) {
        if (j > entries.length) {
          j = entries.length;
        }
        const params = {
          Entries: entries.slice(i, j),
          QueueUrl: `${process.env.sqs}${queueName}`,
        };
        sqs.sendMessageBatch(params, (err, results) => {
          if (!err) {
            fs.unlinkSync(`./${queueName}.txt`);
            if (results.Failed) {
              results.Failed.forEach((message) => {
                container.push({
                  Id: message.Id,
                  MessageBody: message.Message.MessageBody,
                });
                fs.appendFile(`./${queueName}.txt`, `${JSON.stringify({
                  Id: message.Id,
                  MessageBody: message.Message.MessageBody,
                })}\n`, 'utf8', (e) => {
                  console.log(e);
                });
              });
            }
          } else {
            console.log(err);
          }
        });
        i += 10;
        j += 10;
      }
    });
  },
  syncToHardDisk: (queueName, i, messageBody) => {
    fs.appendFile(`./${queueName}.txt`, `${JSON.stringify({
      Id: i.toString(),
      MessageBody: JSON.stringify(messageBody),
    })}\n`, 'utf8', (err) => {
      if (err) {
        console.log(err);
      }
    });
  },
  sendTenMessages: (queueName, container, callback) => {
    const params = {
      Entries: container,
      QueueUrl: `${process.env.sqs}${queueName}`,
    };
    sqs.sendMessageBatch(params, callback);
  },
  unlinkFile: (queueName) => {
    fs.unlinkSync(`./${queueName}.txt`);
  },
  reSync: (queueName, message) => {
    fs.appendFile(`./${queueName}.txt`, `${JSON.stringify({
      Id: message.Id,
      MessageBody: message.Message.MessageBody,
    })}\n`, 'utf8', (err) => {
      console.log(err);
    });
  },
};
