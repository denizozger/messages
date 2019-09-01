"use strict";

const dynamoDb = require("../services/dynamodb");

const handler = async event => {
  const message = JSON.parse(event.body);

  const messageId = event.requestContext.requestId; // requestId is used as the unique identifier of this message

  await dynamoDb.createMessage(messageId, message);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Message is processed" }, null, 2)
  };
};

module.exports = {
  handler
};
