import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { formatValidationErrors } from 'io-ts-reporters';

/**
 * @function validate
 * @returns Error if there was validation errors and null otherwise
 *  */
export const validate =
    <A, O = A, I = unknown>(type: t.Type<A, O, I>) =>
    (data: I): Error | null =>
        pipe(
            type.decode(data),
            E.match(
                (errors) => formatValidationErrors(errors),
                () => null
            )
        );

export const missing = <T extends t.Mixed>(base: T) =>
    t.union([base, t.null, t.undefined]);
