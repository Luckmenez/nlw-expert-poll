import fastify from "fastify";
import websocket from "@fastify/websocket";
import cookie from "@fastify/cookie";
import { createPoll } from "../routes/create-poll";
import { getPoll } from "../routes/get-polls";
import { votePoll } from "../routes/vote-on-poll";
import { pollResults } from "./ws/poll-results";

const app = fastify();

app.register(cookie, {
    secret: "polls-app-secret-key",
    hook: 'onRequest', 
    parseOptions: {}  
})

app.register(websocket);

app.register(createPoll);
app.register(getPoll);
app.register(votePoll);
app.register(pollResults);

app.listen({port: 3333}).then(() => {
    console.log("Server is running on port 3333");
})