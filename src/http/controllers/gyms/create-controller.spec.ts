import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { app } from "@/app";

describe("Create Controller [E2E]", () => {
  beforeEach(async () => {
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it("It should be able to create a Gym", async () => {
    await request(app.server)
    .post("/users")
    .send({
      name: "Jonh Doe",
      email: "jonh.doe@example.com",
      password: "123456",
    });

  const { body: authResponseBody } = await request(app.server)
    .post("/sessions")
    .send({
      email: "jonh.doe@example.com",
      password: "123456",
    });
    
    const createGymResponse = await request(app.server)
    .post("/gyms")
    .set("Authorization", `Bearer ${authResponseBody.token}`)
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