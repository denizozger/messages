"use strict";

const AWS = require("aws-sdk");

AWS.config.update({ region: "eu-west-1" });

const sesClient = new AWS.SES({ apiVersion: "2010-12-01" });

const sendEmail = async (to, content) => {
  const params = {
    Destination: {
      ToAddresses: [to]
    },
    Message: {
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: content
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: "An email from Messages"
      }
    },
    Source: "denizozger@gmail.com",
    ReplyToAddresses: ["denizozger@gmail.com"]
  };

  await sesClient.sendEmail(params).promise();

  console.log(`Sent email to ${to}`);
};

module.exports = {
  sendEmail,
  sesClient
};
