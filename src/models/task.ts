import * as t from 'io-ts';
import { missing } from '../utils/io-ts/io-validation';

export const Task = t.interface({
    id: t.number,
    action: t.string,
    priority: t.number,
    estHours: t.number,
});
export type Task = Readonly<t.TypeOf<typeof Task>>;

export const PartialTask = t.interface({
    id: missing(t.number),
    action: missing(t.string),
    priority: missing(t.number),
    estHours: missing(t.number),
});
export type PartialTask = Readonly<t.TypeOf<typeof PartialTask>>;

export const NewTask = t.interface({
    id: missing(t.number),
    action: t.string,
    priority: t.number,
    estHours: t.number,
});
export type NewTask = Readonly<t.TypeOf<typeof NewTask>>;
