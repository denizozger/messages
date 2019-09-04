# Messages

This mono repository contains functions that are related to processing and listing `Message`s. For the sake of pragmatism, functions share the same dependencies and the custom services that are inside `services/*`. 

## Installation
```sh
$ npm install
```

## Testing
```sh
$ npm test
```

## Deployment
```sh
$ npx serverless deploy
```

Bear in mind that the configuration in `serverless.yml` needs to be amended as there are some hardcoded values.

## Architecture

This architecture favours decoupling and scalability at the expense of simplicity (there is always a trade-off).

```shell script
+-------------------+
|                   |     creates
|  post-message.js  +-------------------+
|                   |                   |
+-------------------+                   |
                                        v
                                      +-+----------------+                     +-----------------------------------+
                                      |                  |    subscribes to    |                                   |      sends an email
                                      |  Messages Table  +<--------------------+  handle-message-created-event.js  +---------------------->
                                      |                  |  new record events  |                                   |
                                      +-+------+---------+                     +----------------+------------------+
                                        ^      ^                                                |
+-------------------+                   |      |                                                |
|                   |     queries       |      |                                                |
|  list-messages.js +-------------------+      | updates                                        | publishes a message
|                   |                          |                                                |
+-------------------+                          |                                                |
                                               |                                                v
                                 +-------------+----------------+                         +-----+-------+
                                 |                              |       subscribes        |             |
                                 |  handle-email-sent-event.js  +------------------------>+  SNS Topic  |
                                 |                              |      to messages        |             |
                                 +------------------------------+                         +-------------+

```

There are two endpoints that exposes a DynamoDb table:
1. `post-message` to create `Message`s
2. `list-messages` to list the `Message`s

The expected business flow is as follows:
1. Client makes a `POST` request to create a `Message`
2. `post-message` function handles the request and creates a `Message` in a DynamoDB table
3. `handle-message-created-event` gets triggered via DynamoDB Streams, it;
    1. Sends the `Message` to the recipient via an email
    2. Publishes an event on `AWS SNS`
4. `handle-email-sent-event` receives the published event, and flags the `Message` as "Email sent"
5. Client queries emails sent to a specific recipient by making a `GET` call which triggers `list-messages` endpoint

## Out of scope

There are a lot of components that are excluded from this project before it could be production-ready, however the most important ones are:
- CI
- CD
- Integration tests
- Error handling on code level
- Error handling on infrastructure level
- Validation
- Containerisation
- Performance tests
- Removing some hardcoded values in IaC