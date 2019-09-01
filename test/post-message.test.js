"use strict";

const { handler: postMessage } = require("../functions/post-message");
const dynamoDbService = require("../services/dynamodb");

const MESSAGE_POST_EVENT = require("./fixtures/post-message-event");

describe("post message function", () => {
  beforeEach(async () => {
    dynamoDbService.docClient.put = jest.fn().mockImplementation(() => ({
      promise: jest.fn().mockResolvedValue(true)
    }));

    console.log = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("saves the message in database", async () => {
    await postMessage(MESSAGE_POST_EVENT);

    const expected = {
      Item: {
        content: "test",
        emailAddress: "denizozger@gmail.com",
        id: "e73eac5a-c90e-11e9-8601-cb0e0faaf38c"
      },
      TableName: undefined
    };
    const actual = dynamoDbService.docClient.put.mock.calls[0][0];

    expect(actual).toEqual(expected);
  });

  it("returns a success response", async () => {
    const expected = {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Message is processed"
        },
        null,
        2
      )
    };
    const actual = await postMessage(MESSAGE_POST_EVENT);

    expect(actual).toEqual(expected);
  });
});
