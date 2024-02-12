import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma";
import z from "zod";
import { Poll } from "@prisma/client";

export async function createPoll(app: FastifyInstance){
  app.post("/polls", async (request: FastifyRequest, reply: FastifyReply) => {

    const createPollBody = z.object({
      title: z.string(),
      options: z.array(z.string())
    })
  
    const { title, options } = createPollBody.parse(request.body);
  
    const poll: Poll = await prisma.poll.create({
      data: {
        title,
        options: {
          createMany: {
            data: options.map((option) => ({
              title: option
            }))
          }
        }
      }
    }) // transactional safe operation
  
    return reply.status(201).send({ id: poll.id });
  })
}