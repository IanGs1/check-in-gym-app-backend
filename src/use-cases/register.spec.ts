import { expect, describe, it, beforeEach } from "vitest";

import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { RegisterUseCase } from "./register";

import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

import { compare } from "bcryptjs";

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  it("An user should be able to register", async () => {
    const { user } = await sut.execute({
      name: "Jonh Doe",
      email: "jonhdoe@email.com",
      password: "123456",
    });

    expect(user.id)
      .toEqual(expect.any(String));
  })

  it("An user password should be hashed upon a registration", async () => {
    const { user } = await sut.execute({
      name: "Jonh Doe",
      email: "jonhdoe@email.com",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await compare("123456", user.password_hash);

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("An user cannot be created with the same email", async () => {
    await sut.execute({
      name: "Jonh Doe",
      email: "jonhdoe@email.com",
      password: "123456",
    });

    await expect(() => 
      sut.execute({
        name: "Jonh Doe",
        email: "jonhdoe@email.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});