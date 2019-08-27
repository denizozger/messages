"use strict";

const dynamodb = require("./services/dynamodb");

const listMessages = async event => {
  console.log(JSON.stringify(event));
  const emailAddress = event.queryStringParameters.emailAddress;
  const messages = await dynamodb.listMessages(emailAddress);
  return {
    statusCode: 200,
    body: JSON.stringify(messages, null, 2)
  };
};

module.exports = {
  listMessages
};
