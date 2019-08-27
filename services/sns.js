"use strict";

const AWS = require("aws-sdk");

const sendNewEmailMessage = message => {
  var payload = {
    default: message,
    GCM: {
      data: {
        message: message
      }
    }
  };

  payload.GCM = JSON.stringify(payload.GCM);
  payload = JSON.stringify(payload);

  const params = {
    Message: payload,
    MessageStructure: "json",
    TopicArn:
      "arn:aws:sns:eu-central-1:710995169233:message-post-dev-email-topic"
  };

  console.log(`Publishing message ${message} to topic ${params.TopicArn}`);

  return new AWS.SNS({ apiVersion: "2010-03-31", region: "eu-central-1" })
    .publish(params)
    .promise();
};

module.exports = {
  sendNewEmailMessage
};
