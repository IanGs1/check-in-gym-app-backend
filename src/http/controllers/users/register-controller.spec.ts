import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";

describe("Register Controller [E2E]", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("It should be able to register", async () => {
    const response = await request(app.server)
      .post("/users")
      .send({
        name: "Jonh Doe",
        email: "jonh.doe@example.com",
        password: "123456",
      });

      expect(response.statusCode).toEqual(201);
  });
})