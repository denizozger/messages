"use strict";

const { handleNewMessages } = require("../functions/handleNewMessage");
const emailService = require("../services/ses");
const snsService = require("../services/sns");

const MESSAGE_CREATED_EVENT = require("./fixtures/dynamodb-record-created-event");
const MESSAGE_DELETED_EVENT = require("./fixtures/dynamodb-record-deleted-event");

describe("handle new message function", () => {
  beforeEach(() => {
    emailService.sesClient.sendEmail = jest.fn().mockImplementation(() => ({
      promise: jest.fn().mockResolvedValue({
        ResponseMetadata: { RequestId: "c60008ee-bb87-4096-a009-8c095d6c33ff" },
        MessageId:
          "0102016cd9604800-0f808a79-d684-46cf-864c-a23b435de914-000000"
      })
    }));

    snsService.snsClient.publish = jest.fn().mockImplementation(() => ({
      promise: jest.fn().mockResolvedValue({
        ResponseMetadata: { RequestId: "725b338d-1e54-5fcb-8de4-666ddc184ed4" },
        MessageId: "0abee958-b739-5fa1-bdf9-bcb87575cebe"
      })
    }));

    console.log = jest.fn();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("sends an email to the recipient", async () => {
    await handleNewMessages(MESSAGE_CREATED_EVENT);

    expect(emailService.sesClient.sendEmail.mock.calls[0][0]).toEqual({
      Destination: { ToAddresses: ["denizozger@gmail.com"] },
      Message: {
        Body: { Text: { Charset: "UTF-8", Data: "TEST" } },
        Subject: { Charset: "UTF-8", Data: "test" }
      },
      ReplyToAddresses: ["denizozger@gmail.com"],
      Source: "denizozger@gmail.com"
    });
  });
  it("publishes a message", async () => {
    await handleNewMessages(MESSAGE_CREATED_EVENT);

    expect(snsService.snsClient.publish.mock.calls[0][0]).toEqual({
      Message:
        '{"default":"4ace885b-c9ba-11e9-a1e7-e12fbd5a77dc","GCM":"{\\"data\\":{\\"message\\":\\"4ace885b-c9ba-11e9-a1e7-e12fbd5a77dc\\"}}"}',
      MessageStructure: "json",
      TopicArn:
        "arn:aws:sns:eu-central-1:710995169233:message-post-dev-email-topic"
    });
  });
  it("does nothing if the event is not an `INSERT` event", async () => {
    await handleNewMessages(MESSAGE_DELETED_EVENT);

    expect(emailService.sesClient.sendEmail.mock.calls[0]).toEqual(undefined);
    expect(snsService.snsClient.publish.mock.calls[0]).toEqual(undefined);
  });
});
