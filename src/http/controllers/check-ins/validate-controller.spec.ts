import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { app } from "@/app";
import prisma from "@/lib/prisma";

import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Validate Controller [E2E]", () => {
  beforeEach(async () => {
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it("It should be able to validate a Check-In", async () => {
    const { token: userToken } = await createAndAuthenticateUser(app, true);

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

    let checkIn = await prisma.checkIn.create({
      data: {
        gym_id: gym.id,
        user_id: user.id,
      },
    });
    
    const validateResponse = await request(app.server)
    .patch(`/check-ins/${checkIn.id}/validate`)
    .set("Authorization", `Bearer ${userToken}`)
    .send();

    checkIn = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkIn.id,
      },
    });

    expect(validateResponse.statusCode).toEqual(204);
    expect(checkIn.validated_at).toEqual(
      expect.any(Date),
    );
  });
});