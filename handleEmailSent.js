"use strict";

const dynamodb = require("./services/dynamodb");

const markMessageAsEmailed = async record => {
  const messageId = record.Sns.Message;
  return dynamodb.updateMessage(messageId);
};

const handleEmailSent = event => {
  console.log(JSON.stringify(event));

  return Promise.all(event.Records.map(markMessageAsEmailed));
};

module.exports = {
  handleEmailSent
};
