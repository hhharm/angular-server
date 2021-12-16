import { RedisClientType } from '@node-redis/client';
import { createClient } from 'redis';
import { logger } from '../../logger';

class Database {
    private client: RedisClientType<any>;

    public async init(): Promise<RedisClientType<any>> {
        const client = createClient();

        client.on('error', (err) => logger.error('Redis Client Error', err));

        await client.connect();

        logger.info('Redis Client is connected');
        this.client = client;
        return client;
    }

    public async create(
        type: EntryType,
        id: string,
        data: unknown
    ): Promise<any> {
        return this.client.hSet(type, id, JSON.stringify(data));
    }

    public async findAll(type: EntryType): Promise<any[]> {
        const objs = await this.client.hGetAll(type);
        return Object.values(objs).map((o) => JSON.parse(o));
    }

    public async find(type: EntryType, id: string): Promise<any> {
        const obj = await this.client.hGet(type, id);
        return JSON.parse(obj);
    }

    public async update(
        type: EntryType,
        id: string | number,
        data: unknown
    ): Promise<number> {
        return this.client.hSet(type, id, JSON.stringify(data));
    }
    public async delete(type: EntryType, id: string): Promise<number> {
        return this.client.hDel(type, id);
    }
}

export type EntryType = 'task' | 'user';

export const db: Database = new Database();
