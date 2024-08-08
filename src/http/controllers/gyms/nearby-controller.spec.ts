import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Nearby Controller [E2E]", () => {
  beforeEach(async () => {
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it("It should be able to list nearby Gyms", async () => {
    const { token: userToken } = await createAndAuthenticateUser(app);
    
    await request(app.server)
    .post("/gyms")
    .set("Authorization", `Bearer ${userToken}`)
    .send({
      title: "Near Gym",
      description: "Near Gym description",
      phone: "11111111",
      latitude: -27.2092052,
      longitude: -49.6401091,
    });

    await request(app.server)
    .post("/gyms")
    .set("Authorization", `Bearer ${userToken}`)
    .send({
      title: "Far Gym",
      description: "Far Gym description",
      phone: "22222222",
      latitude: -27.0610928,
      longitude: -49.5229501,
    });

    const fetchNearbyGymsResponse = await request(app.server)
    .get("/gyms/nearby")
    .query({
      latitude: -27.2092052,
      longitude: -49.6401091,
    })
    .set("Authorization", `Bearer ${userToken}`)
    .send();

    expect(fetchNearbyGymsResponse.statusCode).toEqual(200);
    expect(fetchNearbyGymsResponse.body.gyms).toHaveLength(1);
    expect(fetchNearbyGymsResponse.body.gyms).toEqual([
      expect.objectContaining({
        title: "Near Gym"
      }),
    ]);
  });
});