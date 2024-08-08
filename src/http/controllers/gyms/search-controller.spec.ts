import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Search Controller [E2E]", () => {
  beforeEach(async () => {
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it("It should be able to search for a Gym", async () => {
    const { token: userToken } = await createAndAuthenticateUser(app);
    
    await request(app.server)
    .post("/gyms")
    .set("Authorization", `Bearer ${userToken}`)
    .send({
      title: "Typescript Gym",
      description: "A Gym made for those who likes Typescript",
      phone: null,
      latitude: -15.7214868,
      longitude: -48.1025142,
    });

    await request(app.server)
    .post("/gyms")
    .set("Authorization", `Bearer ${userToken}`)
    .send({
      title: "Javascript Gym",
      description: "A Gym made for those who likes Javascript",
      phone: null,
      latitude: -23.7214868,
      longitude: -37.1025142,
    });

    const searchGymResponse = await request(app.server)
    .get("/gyms/search")
    .query({
      q: "Javascript"
    })
    .set("Authorization", `Bearer ${userToken}`)
    .send();

    expect(searchGymResponse.statusCode).toEqual(200);
    expect(searchGymResponse.body.gyms).toHaveLength(1);
    expect(searchGymResponse.body.gyms).toEqual([
      expect.objectContaining({
        title: "Javascript Gym"
      }),
    ]);
  });
});