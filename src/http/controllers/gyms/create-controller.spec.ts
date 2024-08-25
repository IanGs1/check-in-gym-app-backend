import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Create Gym Controller [E2E]", () => {
  beforeEach(async () => {
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it("It should be able to create a Gym", async () => {
    const { token: userToken } = await createAndAuthenticateUser(app, true);
    
    const createGymResponse = await request(app.server)
    .post("/gyms")
    .set("Authorization", `Bearer ${userToken}`)
    .send({
      title: "Typescript Gym",
      description: "A Gym made for those who likes Typescript",
      phone: null,
      latitude: -15.7214868,
      longitude: -48.1025142,
    });

    expect(createGymResponse.statusCode).toEqual(201);
  });
});