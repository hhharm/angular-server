import { Router } from 'express';
import tasks from './tasks';
import users from './users';
import files from './files';

const router = Router();

router.use('/', tasks);
router.use('/', users);
router.use('/files', files);

export default router;
