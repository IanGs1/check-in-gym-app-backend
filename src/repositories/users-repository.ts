import { Prisma, User } from "@prisma/client";

export interface UsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User>
  findByEmail(email: string): Promise<User | undefined>
  findById(id: string): Promise<User | undefined>
}