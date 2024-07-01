import { expect, describe, it, beforeEach } from "vitest";

import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { SearchGymsUseCase } from "./search-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe("Search Gyms Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it("An User should be able to search for Gyms", async () => {
    await gymsRepository.create({
      title: "First Gym",
      description: "First Gym description",
      phone: "11111111",
      latitude: 0,
      longitude: 0,
    });

    await gymsRepository.create({
      title: "Second Gym",
      description: "Second Gym description",
      phone: "22222222",
      latitude: 0,
      longitude: 0,
    });
    
    const { gyms } = await sut.execute({
      query: "First",
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({
        title: "First Gym"
      }),
    ]);
  });

  it("An User should be able to fetch paginated gyms search", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Javascript Gym ${i}`,
        description: "Javascript Gym",
        phone: "12345678",
        latitude: 0,
        longitude: 0,
      });
    };

    const { gyms } = await sut.execute({
      query: "Javascript",
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Javascript Gym 21" }),
      expect.objectContaining({ title: "Javascript Gym 22" }),
    ]);
  });
});