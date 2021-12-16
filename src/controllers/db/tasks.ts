import excess from 'io-ts-excess';
import { NewTask, PartialTask } from '../../models/task';
import { logger } from '../../logger';
import { ControllerResult } from '../../models/io';
import { validate } from '../../utils/io-ts/io-validation';
import { db, EntryType } from './redis';

const type: EntryType = 'task';

export class TaskController {
    public async getAll(): Promise<ControllerResult> {
        const json = await db.findAll(type);
        return {
            json,
            code: 200,
        };
    }

    public async getOne(id: string): Promise<ControllerResult> {
        logger.info('Getting task with id ' + id);
        if (!Number.isSafeInteger(+id)) {
            return {
                json: { errorMessage: 'Id should be integer' },
                code: 400,
            };
        }
        const task = await db.find(type, id);
        if (task) {
            return {
                json: task,
                code: 200,
            };
        } else {
            logger.info('Task not found', { taskId: id });
            return {
                json: { errorMessage: 'Task not found' },
                code: 404,
            };
        }
    }

    public async updateOne(
        id: string,
        updatedTask: unknown
    ): Promise<ControllerResult> {
        if (!Number.isSafeInteger(+id)) {
            return {
                json: { errorMessage: 'Id should be integer' },
                code: 400,
            };
        }
        const validationErrors = validate(excess(PartialTask))(updatedTask);
        if (validationErrors !== null) {
            return {
                json: { validationErrors },
                code: 400,
            };
        }

        const validatedTask = updatedTask as PartialTask;

        if (validatedTask.id && validatedTask.id != +id) {
            logger.info('Bad request', { taskId: id });
            return {
                json: {
                    errorMessage: 'Task id in path and body does not match',
                },
                code: 400,
            };
        }

        const task = await db.find(type, id);
        if (!task) {
            logger.info('Task not found', { taskId: id });
            return {
                json: {
                    errorMessage: 'Task not found',
                },
                code: 404,
            };
        }

        logger.info('Updating task with id ' + id);
        const json = { ...task, ...validatedTask };
        // partial update is allowed
        await db.update(type, +id, json);
        return {
            json,
            code: 200,
        };
    }

    public async create(newTask: unknown): Promise<ControllerResult> {
        const validationErrors = validate(excess(NewTask))(newTask);
        if (validationErrors !== null) {
            return {
                json: { validationErrors },
                code: 400,
            };
        }

        const validatedTask = newTask as NewTask;

        const taskId = validatedTask.id ?? Date.now();
        const newTaskWithId = { id: taskId, ...validatedTask };

        logger.info('Creating task with id ' + taskId);
        await db.create(type, taskId.toString(), newTaskWithId);

        return {
            json: newTaskWithId,
            code: 201,
        };
    }

    public async deleteOne(id: unknown): Promise<ControllerResult> {
        if (!Number.isSafeInteger(+id)) {
            return {
                json: { errorMessage: 'Id should be integer' },
                code: 400,
            };
        }

        const task = await db.find(type, id.toString());
        if (!task) {
            logger.info('Task not found', { taskId: id });
            return {
                json: {
                    errorMessage: 'Task not found',
                },
                code: 404,
            };
        }

        logger.info('Deleting task with id ' + id);
        await db.delete(type, task.id.toString());
        return {
            json: {},
            code: 200,
        };
    }
}
