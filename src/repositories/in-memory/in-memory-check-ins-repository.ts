import { CheckIn, Prisma } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";

import dayjs from "dayjs";

import { randomUUID } from "node:crypto";

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public checkIns: CheckIn[] = [];

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    };

    this.checkIns.push(checkIn);

    return checkIn;
  };

  async findByUserIdOnDate(userId: string, date: Date) {
      // 2024-06-03T00:00:00 
      const startOfTheDay = dayjs(date).startOf("date");
      // 2024-06-03T23:59:59
      const endOfTheDay = dayjs(date).endOf("date");

      const checkInOnSameDate = this.checkIns.find(checkIn => {
        const checkInDate = dayjs(checkIn.created_at);
        const isOnSameDate = checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);

        return checkIn.user_id === userId && isOnSameDate;
      });

      if (!checkInOnSameDate) {
        return null;
      };

      return checkInOnSameDate;
  };
};