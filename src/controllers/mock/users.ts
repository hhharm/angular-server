import { ControllerResult } from '../../models/io';
import { UserMock } from './data/user';
import excess from 'io-ts-excess';
import { NewUser, PartialUser, User } from '../../models/user';
import { logger } from '../../logger';
import { validate } from '../../utils/io-ts/io-validation';

export class UserController {
    public getAll(): ControllerResult {
        return {
            json: UserMock,
            code: 200,
        };
    }

    public getOne(id: string): ControllerResult {
        logger.info('Getting user with id ' + id);
        if (!Number.isSafeInteger(+id)) {
            return {
                json: { errorMessage: 'Id should be integer' },
                code: 400,
            };
        }
        const user = UserMock.find((user) => user.id === +id);
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

    public updateOne(id: string, updatedUser: unknown): ControllerResult {
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

        const userIndex = UserMock.findIndex((user) => user.id === +id);
        if (userIndex === -1) {
            logger.info('User not found', { userId: id });
            return {
                json: {
                    errorMessage: 'User not found',
                },
                code: 404,
            };
        }

        logger.info('Updating user with id ' + id);
        // partial update is allowed
        UserMock[userIndex] = { ...UserMock[userIndex], ...validatedUser };
        return {
            json: UserMock[userIndex],
            code: 200,
        };
    }

    public create(newUser: unknown): ControllerResult {
        const validationErrors = validate(excess(NewUser))(newUser);
        if (validationErrors !== null) {
            return {
                json: { validationErrors },
                code: 400,
            };
        }

        const validatedUser = newUser as NewUser;

        const userId = Date.now();
        const newUserWithId = { id: userId, ...validatedUser };

        logger.info('Creating user with id ' + userId);
        UserMock.push(newUserWithId);

        return {
            json: newUserWithId,
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

        const userIndex = UserMock.findIndex((user) => user.id === +id);
        if (userIndex === -1) {
            logger.info('User not found', { userId: id });
            return {
                json: {
                    errorMessage: 'User not found',
                },
                code: 404,
            };
        }

        logger.info('Deleting user with id ' + id);
        UserMock.splice(userIndex, 1);
        return {
            json: {},
            code: 200,
        };
    }
}
