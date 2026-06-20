import { registerAs } from "@nestjs/config";

export const appConfig = registerAs("app", () => ({
  nodeEnv: process.env.NODE_ENV || "local",
  port: Number(process.env.BACKEND_PORT ?? 4001) || 4001,
  globalPrefix: process.env.GLOBAL_PREFIX || "api",
  corsOrigin: process.env.BACKEND_CORS_ORIGIN || "http://localhost:4002",
}));
