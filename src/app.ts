import busboy from 'connect-busboy';
import dotenv from 'dotenv';
import express, { json, urlencoded } from 'express';
import expressWinston from 'express-winston';
import { createServer } from 'http';
import winston from 'winston';
import { db } from './controllers/db/redis';
import { logger } from './logger';
import indexRouter from './routes/index';
import { initTaskController } from './routes/tasks';
import { initUserController } from './routes/users';

// initialize configuration
dotenv.config();

const port = process.env.SERVER_PORT ?? 3000;
const app = express();
// app.use(
//     busboy({
//         immediate: true,
//         limits: {
//             fileSize: 10 * 1024 * 1024,
//         },
//     })
// );

app.use(
    expressWinston.logger({
        transports: [new winston.transports.Console()],
        format: winston.format.combine(winston.format.json()),
        meta: process.env.META === 'true', // optional: control whether you want to log the meta data about the request (default to true)
        msg: 'HTTP {{req.method}} {{req.url}}', // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
        expressFormat: false, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
        colorize: process.env.COLORISE === 'true', // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    })
);
app.use(json());
app.use(urlencoded({ extended: false }));

app.use('/', indexRouter);

/**
 * Create HTTP server.
 */
const server = createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
app.listen(port, () =>
    logger.info(`Server started at http://localhost:${port}`)
);

server.on('Error', onError);
server.on('Listening', onListening);

initTaskController();
initUserController();

if (process.env.DATA_FROM_DB === 'true') {
    (async () => {
        await db.init();
    })();
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: { syscall: string; code: any }) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            logger.error(bind + ' requires elevated privileges');
            process.exit(1);
        case 'EADDRINUSE':
            logger.error(bind + ' is already in use');
            process.exit(1);
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = server.address();
    const bind =
        typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    logger.info('Listening on ' + bind);
}
