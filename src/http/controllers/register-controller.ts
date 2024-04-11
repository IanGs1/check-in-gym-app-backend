import { FastifyReply, FastifyRequest } from "fastify";

import { RegisterUseCase } from "@/use-cases/register";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";

import z from "zod";
import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const createUserSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = createUserSchema.parse(request.body);

  try {
    const prismaUsersRepository = new PrismaUsersRepository();
    const registerUseCase = new RegisterUseCase(prismaUsersRepository);
    registerUseCase.execute({ name, email, password });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({
        message: error.message,
      });
    };

    return reply.status(500); // TODO: fix
  } 

  return reply.status(201).send();
}