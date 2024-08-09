import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { app } from "@/app";
import prisma from "@/lib/prisma";

import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Create - Check In [E2E]", () => {
  beforeEach(async () => {
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it("It should be able to create a Check-In", async () => {
    const { token: userToken } = await createAndAuthenticateUser(app);

    const gym = await prisma.gym.create({
      data: {
        title: "Javscript Gym",
        description: "A Gym made for those who likes Typescript",
        phone: null,
        latitude: -15.7214868,
        longitude: -48.1025142,
      },
    });
    
    const createCheckInResponse = await request(app.server)
    .post(`/gyms/${gym.id}/check-ins`)
    .set("Authorization", `Bearer ${userToken}`)
    .send({
      latitude: -15.7214868,
      longitude: -48.1025142,
    });

    expect(createCheckInResponse.statusCode).toEqual(201);
  });
});