"use strict";

const dynamoDb = require("../services/dynamodb");

const markMessageAsEmailed = async record => {
  console.log(`Received SNS message: ${record.Sns.Message}`);
  const { emailAddress, id } = JSON.parse(record.Sns.Message);
  return dynamoDb.markMessageAsEmailSent(emailAddress, id);
};

const handler = event => Promise.all(event.Records.map(markMessageAsEmailed));

module.exports = {
  handler
};
