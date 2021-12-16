import { NextFunction, Request, Response, Router } from 'express';
import { UserController } from '../controllers/db/users';
import { UserController as MockUserController } from '../controllers/mock/users';

let userController: UserController | MockUserController;
const router = Router();

export function initUserController() {
    const useDb = process.env.DATA_FROM_DB === 'true';
    userController = useDb ? new UserController() : new MockUserController();
}

/* Get all users. */
router.get(
    '/users',
    async (_req: Request, res: Response, _next: NextFunction) => {
        const resp = await userController.getAll();
        return res.status(resp.code).json(resp.json);
    }
);

// Create new user
router.post(
    '/users',
    async (req: Request, res: Response, _next: NextFunction) => {
        const resp = await userController.create(req.body);
        return res.status(resp.code).json(resp.json);
    }
);

/* Operations with one existing user. */
router
    .route('/users/:id')
    .get(async (req: Request, res: Response, _next: NextFunction) => {
        const resp = await userController.getOne(req.params.id);
        return res.status(resp.code).json(resp.json);
    })
    .put(async (req: Request, res: Response, _next: NextFunction) => {
        const resp = await userController.updateOne(req.params.id, req.body);
        return res.status(resp.code).json(resp.json);
    })
    .delete(async (req: Request, res: Response, _next: NextFunction) => {
        const resp = await userController.deleteOne(req.params.id);
        return res.status(resp.code).json(resp.json);
    });

export default router;
