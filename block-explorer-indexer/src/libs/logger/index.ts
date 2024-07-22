import winston, { format } from 'winston';
import devFormat from 'winston-format-pretty-console';

const transports = [new winston.transports.Console()];

/**
 * Creates a new logger instance that is used across the board
 */
const logger = winston.createLogger({
  format: process.env.ENV === 'PRODUCTION' ? format.json() : format.combine(format.colorize(), devFormat()),
  defaultMeta: { service: process.env.APPLICATION_NAME || 'APP' },
  transports,
});

export default logger;
