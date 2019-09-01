"use strict";

const dynamoDb = require("../services/dynamodb");

const postMessage = async event => {
  console.log(JSON.stringify(event));
  const message = JSON.parse(event.body);
  await dynamoDb.createMessage(event.requestContext.requestId, message);
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Function executed successfully!"
      },
      null,
      2
    )
  };
};

module.exports = {
  postMessage
};
