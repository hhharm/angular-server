import winston from 'winston';

export const logger = winston.createLogger({
    transports: [new winston.transports.Console()],
    level: 'info',
    format: winston.format.combine(winston.format.json()),
    defaultMeta: { service: 'angular-service' },
});
