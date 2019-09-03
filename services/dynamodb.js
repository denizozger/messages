"use strict";

const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION
});

const createMessage = async (id, message) => {
  const { emailAddress, content } = message;
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id,
      emailAddress,
      content
    }
  };

  console.log(
    `Creating a message record with params: ${JSON.stringify(params)}`
  );

  await docClient.put(params).promise();

  console.log(`Created message: ${JSON.stringify(params)}`);
};

// aws dynamodb update-item \
//     --table-name messages-dev \
//     --key '{
// "id": {"S": "3eff5f70-4784-4b8d-91c0-927056095918"}
// }' \
//     --update-expression 'SET #emailSent = :emailSent' \
//     --expression-attribute-names '{
//   "#emailSent": "emailSent"
// }' \
//     --expression-attribute-values '{
//   ":emailSent": {"BOOL": true}
// }' \
//     $LOCAL

const markMessageAsEmailSent = async (emailAddress, id) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      emailAddress,
      id
    },
    UpdateExpression: "SET #emailSent = :emailSent",
    ExpressionAttributeNames: {
      "#emailSent": "emailSent"
    },
    ExpressionAttributeValues: {
      ":emailSent": true
    },
    ReturnValues: "UPDATED_NEW"
  };

  console.log(`Updating message with parameters ${JSON.stringify(params)}`);

  await docClient.update(params).promise();

  console.log(`Marked message as email sent, message id: ${id}`);
};

// ➜ aws dynamodb query \
//       --table-name messages-dev \
//       --key-condition-expression "emailAddress = :emailAddress" \
//       --filter-expression "emailSent = :emailSent" \
//       --expression-attribute-values '{
// ":emailAddress": { "S": "denizozger@gmail.com" },
// ":emailSent": { "BOOL": true }
// }' \
//       $LOCAL

const listMessages = emailAddress => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    KeyConditionExpression: "emailAddress = :emailAddress",
    FilterExpression: {
      emailSent: ":emailSent"
    },
    ExpressionAttributeValues: {
      ":emailAddress": emailAddress,
      ":emailSent": true
    }
  };

  console.log(`Querying records with params: ${JSON.stringify(params)}`);

  return docClient.query(params).promise();
};

module.exports = {
  createMessage,
  markMessageAsEmailSent,
  listMessages,
  docClient
};
