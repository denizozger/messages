"use strict";

const { handleEmailSent } = require("../functions/handleEmailSent");
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
    await handleEmailSent(EMAIL_SENT_EVENT);

    expect(dynamoDbService.docClient.update.mock.calls[0][0]).toEqual({
      ExpressionAttributeNames: {
        "#emailSent": "emailSent"
      },
      ExpressionAttributeValues: {
        ":emailSent": true
      },
      Key: {
        id: "e73eac5a-c90e-11e9-8601-cb0e0faaf38c"
      },
      ReturnValues: "UPDATED_NEW",
      UpdateExpression: "SET #emailSent = :emailSent"
    });
  });
});
