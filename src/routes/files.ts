import { NextFunction, Request, Response, Router } from 'express';
import * as fs_promise from 'fs/promises';
import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../logger';
import Busboy from 'busboy';

const mimeTypes = new Map<string, string>([
    ['.html', 'text/html'],
    ['.js', 'text/javascript'],
    ['.css', 'text/css'],
    ['.json', 'application/json'],
    ['.png', 'image/png'],
    ['.jpg', 'image/jpg'],
    ['.gif', 'image/gif'],
    ['.svg', 'image/svg+xml'],
    ['.wav', 'audio/wav'],
    ['.mp4', 'video/mp4'],
    ['.woff', 'application/font-woff'],
    ['.ttf', 'application/font-ttf'],
    ['.eot', 'application/vnd.ms-fontobject'],
    ['.otf', 'application/font-otf'],
    ['.wasm', 'application/wasm'],
]);
const router = Router();

//Get file (:id is file, e.g. nice.png)
router
    .route('/:id')
    .get(async (req: Request, res: Response, _next: NextFunction) => {
        const filePath = './files/' + req.params.id;
        const extname = String(path.extname(filePath)).toLowerCase();
        const contentType =
            mimeTypes.get(extname) || 'application/octet-stream';

        const data = await fs_promise.readFile(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(Buffer.from(data), 'utf-8');
    });

async function uploadFile(req: any, res: Response, _next: NextFunction) {
    try {
        var busboy = new Busboy({ headers: req.headers });
        busboy.on(
            'file',
            function (
                _fieldname: any,
                file: { pipe: (arg0: fs.WriteStream) => void },
                filename: string,
                _encoding: any,
                _mimetype: any
            ) {
                const filePath = path.join(process.cwd(), 'files', filename);
                logger.info('Uploading: ' + filePath);

                const writeStream = fs.createWriteStream(filePath);

                file.pipe(writeStream);

                writeStream.on('finish', () => {
                    logger.info('Wrote all data to file');
                });
                writeStream.on('close', () => {
                    logger.info(`Upload of ${filename} is finished`);
                });
            }
        );
        busboy.on('finish', function () {
            res.writeHead(200, { Connection: 'close' });
            res.end('Done!');
        });
        return req.pipe(busboy);
    } catch (err) {
        res.status(500).send(err);
    }
}
// upload file
router.route('/upload').post(uploadFile).put(uploadFile);

export default router;
