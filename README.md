
#Purpose

The purpose for this aplication is to create a poll aplication where we can vote in any desirable theme in real time.
That's an application build up with the main pupose to understand Redis and websocket usage.

##Technologies

In this application there's Fastify, Redis and Prisma on Nodejs runtime.

##Pre-requisites

To run this application you need Node V20.

##Get Started

To run this application all you need is to install node packages with command:

```bash
  $npm install
```

And also run:

```bash
  $npm run start:dev
```

And the server will start to run localhost on port 3333

#Routes:

## POST /polls

Create a poll

### Parameters

- `title`: Poll title (required)
- `options`: poll option list (required)
  
## POST /polls/:pollId/votes

Vote on an expecific poll theme

### Parameters

- `pollId`: id used to chose your poll theme (required)
- `pollOptionId`: poll option based on the actual theme (required)

## GET /polls/:pollId

Get an specific Poll Information

### Parameters

- `pollId`: id used to chose your poll theme (required)

## GET /polls/:pollId

Get an specific Poll Information

### Parameters

- `pollId`: id used to chose your poll theme (required)


