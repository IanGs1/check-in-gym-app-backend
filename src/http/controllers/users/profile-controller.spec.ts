import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Profile Controller [E2E]", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("It should be able to get the user profile", async () => {
      const { token: userToken } = await createAndAuthenticateUser(app);

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