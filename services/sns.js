"use strict";

const AWS = require("aws-sdk");

const snsClient = new AWS.SNS({
  apiVersion: "2010-03-31",
  region: "eu-central-1"
});

const publishEmailSentEvent = async message => {
  let payload = {
    default: message,
    GCM: {
      data: {
        message
      }
    }
  };

  payload.GCM = JSON.stringify(payload.GCM);
  payload = JSON.stringify(payload);

  const params = {
    Message: payload,
    MessageStructure: "json",
    TopicArn: "arn:aws:sns:eu-central-1:710995169233:messages-dev-email-topic"
  };

  await snsClient.publish(params).promise();

  console.log(`Published event ${message} to topic ${params.TopicArn}`);
};

module.exports = {
  publishEmailSentEvent,
  snsClient
};
