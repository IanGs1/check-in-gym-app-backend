import { expect, describe, it, beforeEach } from "vitest";

import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe("Fetch Nearby Gyms Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it("An User should be able to fetch nearby Gyms", async () => {
    await gymsRepository.create({
      title: "Near Gym",
      description: "Near Gym description",
      phone: "11111111",
      latitude: -27.2092052,
      longitude: -49.6401091,
    });

    await gymsRepository.create({
      title: "Far Gym",
      description: "Far Gym description",
      phone: "22222222",
      latitude: -27.0610928,
      longitude: -49.5229501,
    });
    
    const { gyms } = await sut.execute({
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({
        title: "Near Gym"
      }),
    ]);
  });
});