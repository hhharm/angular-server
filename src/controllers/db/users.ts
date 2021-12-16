import { ControllerResult } from '../../models/io';
import excess from 'io-ts-excess';
import { NewUser, PartialUser, User } from '../../models/user';
import { logger } from '../../logger';
import { validate } from '../../utils/io-ts/io-validation';
import { db, EntryType } from './redis';

const type: EntryType = 'user';

export class UserController {
    public async getAll(): Promise<ControllerResult> {
        const json = await db.findAll(type);
        return {
            json,
            code: 200,
        };
    }

    public async getOne(id: string): Promise<ControllerResult> {
        logger.info('Getting user with id ' + id);
        if (!Number.isSafeInteger(+id)) {
            return {
                json: { errorMessage: 'Id should be integer' },
                code: 400,
            };
        }
        const user = await db.find(type, id);
        if (user) {
            return {
                json: user,
                code: 200,
            };
        } else {
            logger.info('User not found', { userId: id });
            return {
                json: { errorMessage: 'User not found' },
                code: 404,
            };
        }
    }

    public async updateOne(
        id: string,
        updatedUser: unknown
    ): Promise<ControllerResult> {
        if (!Number.isSafeInteger(+id)) {
            return {
                json: { errorMessage: 'Id should be integer' },
                code: 400,
            };
        }
        const validationErrors = validate(excess(PartialUser))(updatedUser);
        if (validationErrors !== null) {
            return {
                json: { validationErrors },
                code: 400,
            };
        }

        const validatedUser = updatedUser as PartialUser;

        if (validatedUser.id && validatedUser.id != +id) {
            logger.info('Bad request', { userId: id });
            return {
                json: {
                    errorMessage: 'User id in path and body does not match',
                },
                code: 400,
            };
        }

        const user = await db.find(type, id);
        if (!user) {
            logger.info('User not found', { userId: id });
            return {
                json: {
                    errorMessage: 'User not found',
                },
                code: 404,
            };
        }

        logger.info('Updating user with id ' + id);
        const json = { ...user, ...validatedUser };
        // partial update is allowed
        await db.update(type, +id, json);
        return {
            json,
            code: 200,
        };
    }

    public async create(newUser: unknown): Promise<ControllerResult> {
        const validationErrors = validate(excess(NewUser))(newUser);
        if (validationErrors !== null) {
            return {
                json: { validationErrors },
                code: 400,
            };
        }

        const validatedUser = newUser as NewUser;

        const userId = validatedUser.id ?? Date.now();
        const newUserWithId = { id: userId, ...validatedUser };

        logger.info('Creating user with id ' + userId);
        await db.create(type, userId.toString(), newUserWithId);

        return {
            json: newUserWithId,
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

        const user = await db.find(type, id.toString());
        if (!user) {
            logger.info('User not found', { userId: id });
            return {
                json: {
                    errorMessage: 'User not found',
                },
                code: 404,
            };
        }

        logger.info('Deleting user with id ' + id);
        await db.delete(type, user.id.toString());
        return {
            json: {},
            code: 200,
        };
    }
}
