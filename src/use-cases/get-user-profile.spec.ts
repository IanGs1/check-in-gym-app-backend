import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";

import { GetUserProfileUseCase } from "./get-user-profile";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

import { hash } from "bcryptjs";

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe("Get User Profile UseCase", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it("Should be able to get user profile", async () => {
    const createUserResponse = await usersRepository.create({
      name: "Jonh Doe",
      email: "jonhdoe@email.com",
      password_hash: await hash("123456", 7),
    });

    const { user } = await sut.execute({
      userId: createUserResponse.id,
    });

    expect(user.name).toEqual("Jonh Doe");
  });

  it("Should not be able to get user profile with wrong Id", async () => {
    expect(() => 
      sut.execute({
        userId: "non-existing-userId",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});