import { expect, describe, it, beforeEach } from "vitest";

import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";

import { AuthenticateUseCase } from "./authenticate";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

import { hash } from "bcryptjs";

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    // SUT = System Under Test | SUT is used to avoid getting confused with variable names.
    sut = new AuthenticateUseCase(usersRepository);
  });

  it("An user should be able to register", async () => {
    await usersRepository.create({
      name: "Jonh Doe",
      email: "jonhdoe@email.com",
      password_hash: await hash("123456", 7),
    });

    const { user } = await sut.execute({
      email: "jonhdoe@email.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("Should not be able to authenticate with wrong email", async () => {
    expect(() =>
      sut.execute({
        email: "jonhdoe@email.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("Should not be able to authenticate with wrong password", async () => {
    await usersRepository.create({
      name: "Jonh Doe",
      email: "jonhdoe@email.com",
      password_hash: await hash("123456", 7),
    });

    expect(() =>
      sut.execute({
        email: "jonhdoe@email.com",
        password: "12345",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
