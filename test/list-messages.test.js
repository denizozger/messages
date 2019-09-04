"use strict";

const { handler: listMessages } = require("../functions/list-messages");
const dynamoDbService = require("../services/dynamodb");

const MESSAGE_LIST_EVENT = require("./fixtures/list-messages-event");

describe("list messages function", () => {
  beforeEach(async () => {
    dynamoDbService.docClient.scan = jest.fn().mockImplementation(() => ({
      promise: jest.fn().mockResolvedValue({ Items: [] })
    }));

    console.log = jest.fn();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("queries the database", async () => {
    await listMessages(MESSAGE_LIST_EVENT);

    const expected = {
      ExpressionAttributeNames: {
        "#emailAddress": "emailAddress",
        "#emailSent": "emailSent"
      },
      ExpressionAttributeValues: {
        ":emailAddress": "denizozger@gmail.com",
        ":emailSent": true
      },
      FilterExpression:
        "#emailAddress = :emailAddress and #emailSent = :emailSent"
    };

    const actual = dynamoDbService.docClient.scan.mock.calls[0][0];

    expect(actual).toEqual(expected);
  });

  it("returns the messages", async () => {
    const expected = { body: "[]", statusCode: 200 };
    const actual = await listMessages(MESSAGE_LIST_EVENT);

    expect(actual).toEqual(expected);
  });
});
