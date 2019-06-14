import * as winston from "winston";
import { dependencies } from "./infrastructure/dependencies/dependencies";
import { server } from "./infrastructure/server/server";

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.logstash(),
  transports: [new winston.transports.Console()]
});

const deps = dependencies(logger);
export const application = server(deps);
