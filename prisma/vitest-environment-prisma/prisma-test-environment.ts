import "dotenv/config";

import { Environment } from "vitest";
import { PrismaClient } from "@prisma/client";

import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";

// Connecting to Database
const prisma = new PrismaClient();

/**
 * In this function, I do a serie of things that I'll describe down below:
 * 1º) Verify if the DATABASE_URL exists;
 * 2º) Transform the DATABASE_URL into an URL object;
 * 3º) Change the Schema query in the DATABASE_URL;
 * 4º) Return the DATABASE_URL as a URL for real (turned into a String);
 */
function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("Please provide a DATABASE_URL environment variable");
  };

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set("schema", schema);

  return url.toString();
};

export default <Environment>{
  name: "prisma",
  transformMode: 'ssr',
  async setup() {
    const schema = randomUUID();

    const databaseURL = generateDatabaseURL(schema);
    process.env.DATABASE_URL = databaseURL;

    execSync("npx prisma migrate deploy");

    return {
      async teardown() {
        await prisma.$queryRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
        await prisma.$disconnect();
      },
    };
  },
}