import { Gym, Prisma } from "@prisma/client";
import { FindManyNearbyParams, GymsRepository } from "../gyms-repository";
import { randomUUID } from "crypto";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = [];

  async findById(id: string) {
    const gym = this.gyms.find(gym => gym.id === id);

    if (!gym) {
      return null;
    };

    return gym;
  };

  async searchMany(query: string, page: number) {
    return this.gyms
      .filter(gym => gym.title.includes(query))
      .slice((page - 1) * 20, page * 20);
  };

  async findManyNearby(userInfos: FindManyNearbyParams) {
    return this.gyms.filter((gym) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: userInfos.latitude, longitude: userInfos.longitude },
        { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() },
      );

      return distance < 10;
    });
  };

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description,
      phone: data.phone,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
    } as Gym;

    this.gyms.push(gym);

    return gym;
  };
};