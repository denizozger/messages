"use strict";

const { postMessage } = require("../functions/postMessage");
const dynamoDbService = require("../services/dynamodb");

const MESSAGE_POST_EVENT = require("./fixtures/post-message-event");

describe("handle new message function", () => {
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

    expect(dynamoDbService.docClient.put.mock.calls[0][0]).toEqual({
      Item: {
        content: "test",
        emailAddress: "denizozger@gmail.com",
        id: "e73eac5a-c90e-11e9-8601-cb0e0faaf38c"
      },
      TableName: undefined
    });
  });

  it("returns a success response", async () => {
    const expected = {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Function executed successfully!"
        },
        null,
        2
      )
    };
    const actual = await postMessage(MESSAGE_POST_EVENT);

    expect(expected).toEqual(actual);
  });
});
