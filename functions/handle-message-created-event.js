"use strict";

const AWS = require("aws-sdk");
const R = require("ramda");

const emailService = require("../services/ses");
const snsService = require("../services/sns");

const getEventName = R.prop("eventName");

const isInsertEvent = R.pipe(
  getEventName,
  R.equals("INSERT")
);

const isNotInsertEvent = R.complement(isInsertEvent);

const extractMessageFromDynamoDbEventRecord = R.pipe(
  R.path(["dynamodb", "NewImage"]),
  AWS.DynamoDB.Converter.unmarshall
);

const handleMessageCreatedEvent = async record => {
  if (isNotInsertEvent(record)) {
    console.log(`Skipping handling ${getEventName(record)} event`);
    return;
  }

  const newMessage = extractMessageFromDynamoDbEventRecord(record);

  await emailService.sendEmail(newMessage.emailAddress, newMessage.content);
  await snsService.publishEmailSentEvent({
    id: newMessage.id,
    emailAddress: newMessage.emailAddress
  });
};

const handler = event =>
  Promise.all(event.Records.map(handleMessageCreatedEvent));

module.exports = {
  handler
};
