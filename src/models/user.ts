import * as t from 'io-ts';
import { missing } from '../utils/io-ts/io-validation';

export const User = t.interface({
    id: t.number,
    firstName: t.string,
    lastName: t.string,
});
export type User = Readonly<t.TypeOf<typeof User>>;

export const PartialUser = t.interface({
    id: missing(t.number),
    firstName: missing(t.string),
    lastName: missing(t.string),
});
export type PartialUser = Readonly<t.TypeOf<typeof PartialUser>>;

export const NewUser = t.interface({
    id: missing(t.number),
    firstName: t.string,
    lastName: t.string,
});
export type NewUser = Readonly<t.TypeOf<typeof NewUser>>;
