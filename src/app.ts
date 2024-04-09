import fastify, { FastifyReply, FastifyRequest } from "fastify";

import { appRoutes } from "./http/routes";

export const app = fastify();

app.register(appRoutes)