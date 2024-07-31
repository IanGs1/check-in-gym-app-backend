import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
  PORT: z.coerce.number().default(3333), 
  JWT_SECRET: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("Error on the follow Environment Variable: ", _env.error.format())
  throw new Error("❌ Invalid Environment Variables");
};

const env = _env.data;

export default env;