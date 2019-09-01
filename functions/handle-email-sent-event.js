"use strict";

const dynamoDb = require("../services/dynamodb");

const markMessageAsEmailed = async record => {
  const messageId = record.Sns.Message;
  return dynamoDb.updateMessage(messageId);
};

const handler = event => Promise.all(event.Records.map(markMessageAsEmailed));

module.exports = {
  handler
};
