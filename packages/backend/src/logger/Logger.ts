import pino from "pino"

export type Logger = pino.Logger

export function createLogger(): Logger {
  const isDevelopment = process.env.NODE_ENV !== "production"

  return pino({
    level: process.env.LOG_LEVEL || "info",
    transport: isDevelopment
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        }
      : undefined,
  })
}
