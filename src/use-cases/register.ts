import { hash } from "bcryptjs";

import prisma from "@/lib/prisma";
import { PrismaUsersRepository } from "@/repositories/prisma-users-repository";

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

export async function registerUseCase({ name, email, password }: RegisterUseCaseRequest) {
  const password_hash = await hash(password, 7);

  const emailAlreadyInUse = await prisma.user.findUnique({
    where: {
      email,
    }
  });
  if (emailAlreadyInUse) {
    throw new Error("Email already exists!");
  };

  const prismaUsersRepository = new PrismaUsersRepository();
  prismaUsersRepository.create({
    name,
    email,
    password_hash,
  })
}