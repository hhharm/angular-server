import { TaskMock } from './controllers/mock/data/task';
import { UserMock } from './controllers/mock/data/user';
import axios from 'axios';

const instance = axios.create({
    proxy: false,
    baseURL: 'http://localhost:3000',
    headers: { 'Content-Type': 'application/json' },
});

async function main() {
    try {
        UserMock.forEach((user) => sendRequest('/users', user));
        TaskMock.forEach((task) => sendRequest('/tasks', task));
        console.log('Done!');
    } catch (e) {
        console.error(e);
        console.error('Some error happened!');
    }
}
async function sendRequest(path: string, data: object): Promise<void> {
    console.log(data);
    await instance.post(path, data);
}

main();
