"use strict";

const AWS = require("aws-sdk");
const R = require("ramda");

const emailService = require("./services/email");
const snsService = require("./services/sns");

const getEventName = R.prop("eventName");

const isInsertEvent = R.pipe(
  getEventName,
  R.equals("INSERT")
);

const isNotInsertEvent = R.complement(isInsertEvent);

const getNewMessage = R.pipe(
  R.path(["dynamodb", "NewImage"]),
  AWS.DynamoDB.Converter.unmarshall
);

const handleNewMessage = async record => {
  console.log(JSON.stringify(record));

  if (isNotInsertEvent(record)) {
    console.log(`Skipping handling ${getEventName(record)} event`);
    return;
  }

  const newMessage = getNewMessage(record);

  console.log(newMessage);

  await emailService.sendEmail(newMessage.emailAddress, newMessage.content);
  await snsService.sendNewEmailMessage(newMessage.id);
};

const handleNewMessages = async event => {
  console.log(JSON.stringify(event));
  await Promise.all(event.Records.map(handleNewMessage));
};

module.exports = {
  handleNewMessages
};
