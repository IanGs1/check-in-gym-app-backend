import fastify, { FastifyReply, FastifyRequest } from "fastify";

import z from "zod";
import prisma from "./lib/prisma";

export const app = fastify();

app.post("/users", async (request: FastifyRequest, reply: FastifyReply) => {
  const createUserSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = createUserSchema.parse(request.body);

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash: password,
    },
  });

  return reply.status(201).send();
})