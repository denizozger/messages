"use strict";

const { listMessages } = require("../listMessages");
const dynamoDbService = require("../services/dynamodb");

const MESSAGE_LIST_EVENT = require("./fixtures/list-messages-event");

describe("handle new message function", () => {
  beforeEach(async () => {
    dynamoDbService.docClient.query = jest.fn().mockImplementation(() => ({
      promise: jest.fn().mockResolvedValue(true)
    }));

    console.log = jest.fn();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("saves the message in database", async () => {
    await listMessages(MESSAGE_LIST_EVENT);

    expect(dynamoDbService.docClient.query.mock.calls[0][0]).toEqual({
      ExpressionAttributeNames: {
        "#emailAddress": "emailAddress",
        "#emailSent": "emailSent"
      },
      ExpressionAttributeValues: {
        ":emailAddress": "denizozger@gmail.com",
        ":emailSent": true
      },
      KeyConditionExpression:
        "#emailAddress = :emailAddress AND #emailSent = :emailSent"
    });
  });

  it("returns a success response", async () => {
    const expected = { body: "true", statusCode: 200 };
    const actual = await listMessages(MESSAGE_LIST_EVENT);

    expect(expected).toEqual(actual);
  });
});
