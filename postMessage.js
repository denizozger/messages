"use strict";

const dynamoDb = require("./services/dynamodb");

const postMessage = async event => {
  console.log(JSON.stringify(event));
  const message = JSON.parse(event.body);
  await dynamoDb.createMessage(event.requestContext.requestId, message);
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Go Serverless v1.0! Your function executed successfully!",
        input: event
      },
      null,
      2
    )
  };
};

module.exports = {
  postMessage
};
