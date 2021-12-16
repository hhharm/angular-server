import { Task } from '../../../models/task';

export const TaskMock: Task[] = [
    { id: 1, action: 'Estimate', priority: 1, estHours: 8 },
    { id: 2, action: 'Create', priority: 2, estHours: 8 },
    { id: 3, action: 'Edit', priority: 3, estHours: 4 },
    { id: 4, action: 'Delete', priority: 3, estHours: 2 },
    { id: 5, action: 'Build', priority: 1, estHours: 4 },
    { id: 6, action: 'Deploy', priority: 2, estHours: 8 },
];
