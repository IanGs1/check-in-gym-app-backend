import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";

describe("Profile Controller [E2E]", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("It should be able to get the user profile", async () => {
    await request(app.server)
      .post("/users")
      .send({
        name: "Jonh Doe",
        email: "jonh.doe@example.com",
        password: "123456",
      });

    const authResponse = await request(app.server)
      .post("/sessions")
      .send({
        email: "jonh.doe@example.com",
        password: "123456",
      });

      const { token: userToken } = authResponse.body;

      const profileResponse = await request(app.server)
      .get("/me")
      .set("Authorization", `Bearer ${userToken}`);

      expect(profileResponse.statusCode).toEqual(200);
      expect(profileResponse.body.user).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          email: "jonh.doe@example.com",
        }),
      ); 
  });
})