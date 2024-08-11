import { FastifyReply, FastifyRequest } from "fastify";

import { makeAuthenticateUseCase } from "@/use-cases/factories/make-authenticate-use-case";
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";

import z from "zod";

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({
    onlyCookie: true,
  });

  const token = await reply.jwtSign(
    {},
    {
      sign: {
        sub: request.user.sub
      }
    }
  );

  const refreshToken = await reply.jwtSign(
    {},
    {
      sign: {
        sub: request.user.sub,
        expiresIn: "7d",
      },
    },
  );

  return reply
  .setCookie("refreshToken", refreshToken, {
    path: "/",
    secure: true,
    sameSite: true,
    httpOnly: true,
  })
  .status(200)
  .send({
    token,
  })
}