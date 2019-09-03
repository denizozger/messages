"use strict";

const {
  handler: handleNewMessagesEvent
} = require("../functions/handle-message-created-event");
const emailService = require("../services/ses");
const snsService = require("../services/sns");

const MESSAGE_CREATED_EVENT = require("./fixtures/dynamodb-record-created-event");
const MESSAGE_DELETED_EVENT = require("./fixtures/dynamodb-record-deleted-event");

describe("handle message created event function", () => {
  beforeEach(() => {
    emailService.sesClient.sendEmail = jest.fn().mockImplementation(() => ({
      promise: jest.fn().mockResolvedValue(true)
    }));

    snsService.snsClient.publish = jest.fn().mockImplementation(() => ({
      promise: jest.fn().mockResolvedValue(true)
    }));

    console.log = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("sends an email to the recipient", async () => {
    await handleNewMessagesEvent(MESSAGE_CREATED_EVENT);

    const expected = {
      Destination: { ToAddresses: ["denizozger@gmail.com"] },
      Message: {
        Body: { Text: { Charset: "UTF-8", Data: "TEST" } },
        Subject: { Charset: "UTF-8", Data: "test" }
      },
      ReplyToAddresses: ["denizozger@gmail.com"],
      Source: "denizozger@gmail.com"
    };

    const actual = emailService.sesClient.sendEmail.mock.calls[0][0];

    expect(actual).toEqual(expected);
  });

  it("publishes a message", async () => {
    await handleNewMessagesEvent(MESSAGE_CREATED_EVENT);

    const expected = {
      Message:
        '{"default":"4ace885b-c9ba-11e9-a1e7-e12fbd5a77dc","GCM":"{\\"data\\":{\\"message\\":\\"4ace885b-c9ba-11e9-a1e7-e12fbd5a77dc\\"}}"}',
      MessageStructure: "json",
      TopicArn: "arn:aws:sns:eu-central-1:710995169233:messages-dev-email-topic"
    };

    const actual = snsService.snsClient.publish.mock.calls[0][0];

    expect(actual).toEqual(expected);
  });

  it("does nothing if the event is not an `INSERT` event", async () => {
    await handleNewMessagesEvent(MESSAGE_DELETED_EVENT);

    expect(emailService.sesClient.sendEmail.mock.calls[0]).toEqual(undefined);
    expect(snsService.snsClient.publish.mock.calls[0]).toEqual(undefined);
  });
});
