import { FastifyInstance } from "fastify";

import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";

import { create } from "./create-controller";
import { search } from "./search-controller";
import { nearby } from "./nearby-controller";

export async function gymRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.post("/gyms", { onRequest: [ verifyUserRole("ADMIN") ] }, create);

  app.get("/gyms/search", search);
  app.get("/gyms/nearby", nearby);
};