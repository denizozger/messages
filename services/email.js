"use strict";

const AWS = require("aws-sdk");

AWS.config.update({ region: "eu-west-1" });

const sesClient = new AWS.SES({ apiVersion: "2010-12-01" });

const sendEmail = (to, content) => {
  const params = {
    Destination: {
      ToAddresses: [to]
    },
    Message: {
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: "TEST"
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: content
      }
    },
    Source: "denizozger@gmail.com",
    ReplyToAddresses: ["denizozger@gmail.com"]
  };

  return sesClient.sendEmail(params).promise();
};

module.exports = {
  sendEmail,
  sesClient
};
