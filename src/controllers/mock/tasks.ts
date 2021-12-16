import excess from 'io-ts-excess';
import { NewTask, PartialTask } from '../../models/task';
import { TaskMock } from './data/task';
import { logger } from '../../logger';
import { ControllerResult } from '../../models/io';
import { validate } from '../../utils/io-ts/io-validation';

export class TaskController {
    public getAll(): ControllerResult {
        return {
            json: TaskMock,
            code: 200,
        };
    }

    public getOne(id: string): ControllerResult {
        logger.info('Getting task with id ' + id);
        if (!Number.isSafeInteger(+id)) {
            return {
                json: { errorMessage: 'Id should be integer' },
                code: 400,
            };
        }
        const task = TaskMock.find((task) => task.id === +id);
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

    public updateOne(id: string, updatedTask: unknown): ControllerResult {
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

        const taskIndex = TaskMock.findIndex((task) => task.id === +id);
        if (taskIndex === -1) {
            logger.info('Task not found', { taskId: id });
            return {
                json: {
                    errorMessage: 'Task not found',
                },
                code: 404,
            };
        }

        logger.info('Updating task with id ' + id);
        // partial update is allowed
        TaskMock[taskIndex] = { ...TaskMock[taskIndex], ...validatedTask };
        return {
            json: TaskMock[taskIndex],
            code: 200,
        };
    }

    public create(newTask: unknown): ControllerResult {
        const validationErrors = validate(excess(NewTask))(newTask);
        if (validationErrors !== null) {
            return {
                json: { validationErrors },
                code: 400,
            };
        }

        const validatedTask = newTask as NewTask;

        const taskId = Date.now();
        const newTaskWithId = { id: taskId, ...validatedTask };

        logger.info('Creating task with id ' + taskId);
        TaskMock.push(newTaskWithId);

        return {
            json: newTaskWithId,
            code: 201,
        };
    }

    public deleteOne(id: unknown): ControllerResult {
        if (!Number.isSafeInteger(+id)) {
            return {
                json: { errorMessage: 'Id should be integer' },
                code: 400,
            };
        }

        const taskIndex = TaskMock.findIndex((task) => task.id === +id);
        if (taskIndex === -1) {
            logger.info('Task not found', { taskId: id });
            return {
                json: {
                    errorMessage: 'Task not found',
                },
                code: 404,
            };
        }

        logger.info('Deleting task with id ' + id);
        TaskMock.splice(taskIndex, 1);
        return {
            json: {},
            code: 200,
        };
    }
}
