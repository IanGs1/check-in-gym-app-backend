import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { app } from "@/app";
import prisma from "@/lib/prisma";

import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Metrics Controller [E2E]", () => {
  beforeEach(async () => {
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it("It should be able to get the total count of Check-Ins", async () => {
    const { token: userToken } = await createAndAuthenticateUser(app);

    const user = await prisma.user.findFirstOrThrow();

    const gym = await prisma.gym.create({
      data: {
        title: "Javscript Gym",
        description: "A Gym made for those who likes Typescript",
        phone: null,
        latitude: -15.7214868,
        longitude: -48.1025142,
      },
    });

    await prisma.checkIn.createMany({
      data: [
        {
          gym_id: gym.id,
          user_id: user.id,
        },
        {
          gym_id: gym.id,
          user_id: user.id,
        },
      ],
    });
    
    const metricsResponse = await request(app.server)
    .get(`/check-ins/metrics`)
    .set("Authorization", `Bearer ${userToken}`)
    .send();

    expect(metricsResponse.statusCode).toEqual(200);
    expect(metricsResponse.body.checkInsCount).toEqual(2)
  });
});