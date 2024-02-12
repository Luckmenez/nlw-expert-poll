import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { randomUUID } from "node:crypto";
import z from "zod";
import { prisma } from "../lib/prisma";
import { Vote } from "@prisma/client";
import { redis } from "../lib/redis";
import { voting } from "../utils/voting-pub-sub";

export async function votePoll(app: FastifyInstance){
  app.post("/polls/:pollId/votes", async (request: FastifyRequest, reply: FastifyReply) => {

    const voteOnPollBody = z.object({
      pollOptionId: z.string().uuid()
    })

    const voteOnPollParam = z.object({
      pollId: z.string().uuid()
    })
  
    const { pollOptionId } = voteOnPollBody.parse(request.body);
    const { pollId } = voteOnPollParam.parse(request.params);
  
    let {sessionId} = request.cookies;

    if(sessionId){
      const isUserAlreadyVotedOnPoll: Vote | null = await prisma.vote.findUnique({
        where:{
          sessionId_pollId: {
            pollId,
            sessionId
          }
        }
      })

      
      if(isUserAlreadyVotedOnPoll && isUserAlreadyVotedOnPoll?.pollOptionId !== pollOptionId){
        await prisma.vote.delete({
          where: {
            id: isUserAlreadyVotedOnPoll.id
          }
        })
        
        const votes = await redis.zincrby(pollId, -1, isUserAlreadyVotedOnPoll.pollOptionId)

        voting.publish(pollId, {
          pollOptionId: isUserAlreadyVotedOnPoll.pollOptionId,
          votes: Number(votes),
        })
      } else if(isUserAlreadyVotedOnPoll) {
        return reply.status(400).send({ message: "You already voted on this poll"})
      }
    }

    if(!sessionId){
      sessionId = randomUUID();

      reply.setCookie("sessionId", sessionId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        signed: true,
        httpOnly: true
      });      
    }

    await prisma.vote.create({
      data: {
        sessionId,
        pollOptionId,
        pollId
      }
    })
    
    await redis.zincrby(pollId, 1, pollOptionId)

    const votes = await redis.zincrby(pollId, 1, pollOptionId)

    voting.publish(pollId, {
      pollOptionId,
      votes: Number(votes),
    })
    
    return reply.status(201).send()
  })
}