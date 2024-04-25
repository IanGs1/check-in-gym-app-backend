import { expect, describe, it } from "vitest";

import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";

import { AuthenticateUseCase } from "./authenticate";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

import { hash } from "bcryptjs";

describe("Authenticate Use Case", () => {
  it("An user should be able to register", async () => {
    const usersRepository = new InMemoryUsersRepository();
    // SUT = System Under Test | SUT is used to avoid getting confused with variable names.
    const sut = new AuthenticateUseCase(usersRepository);

    await usersRepository.create({
      name: "Jonh Doe",
      email: "jonhdoe@email.com",
      password_hash: await hash("123456", 7),
    });

    const { user } = await sut.execute({
      email: "jonhdoe@email.com",
      password: "123456",
    });

    expect(user.id)
      .toEqual(expect.any(String));
  });

  it("Should not be able to authenticate with wrong email", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(usersRepository);

    expect(() => sut.execute({
      email: "jonhdoe@email.com",
      password: "123456",
    }))
      .rejects.toBeInstanceOf(InvalidCredentialsError);
  }); 

  it("Should not be able to authenticate with wrong password", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(usersRepository);

    await usersRepository.create({
      name: "Jonh Doe",
      email: "jonhdoe@email.com",
      password_hash: await hash("123456", 7),
    });

    expect(() => sut.execute({
      email: "jonhdoe@email.com",
      password: "12345"
    }))
      .rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});