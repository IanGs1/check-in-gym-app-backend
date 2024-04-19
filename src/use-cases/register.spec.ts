import { expect, describe, it } from "vitest";

import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { RegisterUseCase } from "./register";

import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

import { compare } from "bcryptjs";

describe("Register Use Case", () => {
  it("An user should be able to register", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: "Jonh Doe",
      email: "jonhdoe@email.com",
      password: "123456",
    });

    expect(user.id)
      .toEqual(expect.any(String));
  })

  it("An user password should be hashed upon a registration", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: "Jonh Doe",
      email: "jonhdoe@email.com",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await compare("123456", user.password_hash);

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("An user cannot be created with the same email", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    await registerUseCase.execute({
      name: "Jonh Doe",
      email: "jonhdoe@email.com",
      password: "123456",
    });

    await expect(() => 
      registerUseCase.execute({
        name: "Jonh Doe",
        email: "jonhdoe@email.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});