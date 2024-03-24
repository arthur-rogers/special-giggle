type KeyType = Record<string, any>;

export interface DatabaseService<T> {
    save: (item: T) => Promise<T>;
    get: (key: KeyType) => Promise<T | T[]>;
    update: (item: Partial<T>, key: KeyType) => Promise<T>;
    delete: (key: KeyType) => Promise<T>
}