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

const updateMessage = async id => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id
    },
    UpdateExpression: "SET #emailSent = :emailSent",
    ExpressionAttributeNames: {
      "#emailSent": "emailSent"
    },
    ExpressionAttributeValues: {
      ":emailSent": "true"
    },
    ReturnValues: "UPDATED_NEW"
  };

  await docClient.update(params).promise();

  console.log(`Marked message as email sent, message id: ${id}`);
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
