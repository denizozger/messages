"use strict";

const {
  handler: handleEmailSentEvent
} = require("../functions/handle-email-sent-event");
const dynamoDbService = require("../services/dynamodb");

const EMAIL_SENT_EVENT = require("./fixtures/sns-email-sent-event");

describe("handle email sent function", () => {
  beforeEach(async () => {
    dynamoDbService.docClient.update = jest.fn().mockImplementation(() => ({
      promise: jest.fn().mockResolvedValue(true)
    }));

    console.log = jest.fn();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("marks the message as `emailed` in the database", async () => {
    await handleEmailSentEvent(EMAIL_SENT_EVENT);

    expect(dynamoDbService.docClient.update.mock.calls[0][0]).toEqual({
      ExpressionAttributeNames: {
        "#emailSent": "emailSent"
      },
      ExpressionAttributeValues: {
        ":emailSent": true
      },
      Key: {
        id: "8c01769c-7d66-49ac-af09-9d69c492378b",
        emailAddress: "denizozger@gmail.com"
      },
      ReturnValues: "UPDATED_NEW",
      UpdateExpression: "SET #emailSent = :emailSent"
    });
  });
});
