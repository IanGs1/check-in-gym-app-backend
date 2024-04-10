import { FastifyReply, FastifyRequest } from "fastify";

import { registerUseCase } from "@/use-cases/register";

import z from "zod";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const createUserSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = createUserSchema.parse(request.body);

  try {
    registerUseCase({ name, email, password });
  } catch (error) {
    return reply.status(409).send()
  } 

  return reply.status(201).send();
}