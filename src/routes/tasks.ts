import { NextFunction, Request, Response, Router } from 'express';
import { TaskController } from '../controllers/db/tasks';
import { TaskController as MockTaskController } from '../controllers/mock/tasks';

let taskController: TaskController | MockTaskController;
const router = Router();

export function initTaskController() {
    const useDb = process.env.DATA_FROM_DB === 'true';
    taskController = useDb ? new TaskController() : new MockTaskController();
}

/* Get all tasks. */
router.get(
    '/tasks',
    async (_req: Request, res: Response, _next: NextFunction) => {
        const resp = await taskController.getAll();
        return res.status(resp.code).json(resp.json);
    }
);

// Create new task
router.post(
    '/tasks',
    async (req: Request, res: Response, _next: NextFunction) => {
        const resp = await taskController.create(req.body);
        return res.status(resp.code).json(resp.json);
    }
);

/* Operations with one existing task. */
router
    .route('/tasks/:id')
    .get(async (req: Request, res: Response, _next: NextFunction) => {
        const resp = await taskController.getOne(req.params.id);
        return res.status(resp.code).json(resp.json);
    })
    .put(async (req: Request, res: Response, _next: NextFunction) => {
        const resp = await taskController.updateOne(req.params.id, req.body);
        return res.status(resp.code).json(resp.json);
    })
    .delete(async (req: Request, res: Response, _next: NextFunction) => {
        const resp = await taskController.deleteOne(req.params.id);
        return res.status(resp.code).json(resp.json);
    });

export default router;
