"use strict";

const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION
});

const createMessage = (requestId, message) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: requestId,
      emailAddress: message.emailAddress,
      content: message.content
    }
  };

  console.log(`Creating a record with params: ${JSON.stringify(params)}`);

  return docClient.put(params).promise();
};

const updateMessage = messageId => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: messageId
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

  console.log(`Updating record with params: ${JSON.stringify(params)}`);

  return docClient.update(params).promise();
};

const listMessages = emailAddress => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    KeyConditionExpression:
      "#emailAddress = :emailAddress AND #emailSent = :emailSent",
    ExpressionAttributeNames: {
      "#emailSent": "emailSent",
      "#emailAddress": "emailAddress"
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
  updateMessage,
  listMessages,
  docClient
};
