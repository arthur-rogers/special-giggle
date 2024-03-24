import { DeleteItemCommand, DynamoDBClient,  GetItemCommand,  PutItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { DatabaseService } from "../interface";

export class DynamoService<T extends object> implements DatabaseService<T> {
    private table: string;
    private client: DynamoDBClient
    constructor(tableName: string) {
        this.table = tableName;
        this.client = new DynamoDBClient();
    }

    async save(item: T): Promise<T> {
        const command  = new PutItemCommand({
            TableName: this.table,
            Item: marshall(item),
            ReturnValues: 'ALL_OLD'
        })
        console.info('command', command);
        const response = await this.client.send(command);
        console.info('response', response);
        return item;
    }

    async get(key: Record<string, any>): Promise<T | T[]> {
        const command = new GetItemCommand({
            TableName: this.table,
            Key: marshall(key),
        })
        const response = await this.client.send(command);
        console.info('response', response);
        return unmarshall(response.Item!) as T | T[];
    }

    async update(item: Partial<T>, key: Record<string, any>): Promise<T> {
        const {updateExpression, attributeNames, attributeValues} = this.generateUpdateExpression(item);
        const command = new UpdateItemCommand({
            TableName: this.table,
            Key: marshall(key),
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: marshall(attributeValues),
            ExpressionAttributeNames: attributeNames,
            ReturnValues: 'ALL_NEW'
        })
        const response = await this.client.send(command);
        return unmarshall(response.Attributes!) as T;
    }

    async delete(key: Record<string, any>): Promise<T> {
        const command = new DeleteItemCommand({
            TableName: this.table,
            Key: marshall(key),
            ReturnValues: 'ALL_OLD'
        })
        const response = await this.client.send(command);
        console.info('response', response);
        return unmarshall(response.Attributes!) as T;
    }

    private generateUpdateExpression(updateData: Record<string, any>) {
        const expressions: string[] = [];
        const attributeNames: Record<string, any> = {};
        const attributeValues: Record<string, any> = {};
    
        Object.keys(updateData).forEach((key, index) => {
            const attributeName = `#attr${index}`;
            const attributeValue = `:val${index}`;
            expressions.push(`${attributeName} = ${attributeValue}`);
            attributeNames[attributeName] = key;
            attributeValues[attributeValue] = updateData[key];
        });
    
        const updateExpression = `SET ${expressions.join(', ')}`;
        // console.info('updateExpression',updateExpression);
        // console.info('attributeNames',attributeNames);
        // console.info('attributeValues',attributeValues);
        return {
            updateExpression,
            attributeNames,
            attributeValues
        };
    }

}