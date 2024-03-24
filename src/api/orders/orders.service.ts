import { DatabaseService } from "../../database/interface";
import { v4 as uuidv4 } from 'uuid';
import { Order } from "./types";
import { DynamoService } from "../../database/dynamodb/dynamodb.serive";
import Joi from "joi";

export class OrdersService {
    private dbService: DatabaseService<Order>;
    private tableName: string;
    private validationSchema: Joi.Schema;
    constructor(tableName: string) {
        this.tableName = tableName;
        this.dbService = new DynamoService<Order>(this.tableName)
        this.validationSchema = Joi.object({
            userId: Joi.string().uuid().required(),
            orderId: Joi.string().uuid(),
            amount: Joi.number().required()
        })
    }

    async createOrder(order: Order): Promise<Order | undefined> {
        try {
            order.orderId = uuidv4();
            await this.validationSchema.validateAsync(order);
            const newOrder = await this.dbService.save(order);
            return newOrder;
        } catch(e) {
            console.error(e);
        }
    }

    async getOrder(userId: string, orderId: string): Promise<Order | Order[] | undefined> {
        try {
            await Joi.string().uuid().validateAsync(orderId);
            await Joi.string().uuid().validateAsync(userId);
            return await this.dbService.get({userId, orderId})
        } catch(e) {
            console.error(e);
        }
    }

    async updateOrder(userId: string, orderId: string, updateData: Partial<Order>): Promise<Order | undefined> {
        try {
            await Joi.string().uuid().validateAsync(orderId);
            await Joi.string().uuid().validateAsync(userId);
            const updatedOrder = await this.dbService.update(updateData, {userId, orderId})
            return updatedOrder;
        } catch(e) {
            console.error(e);
        }
    }

    async deleteOrder(userId: string, orderId: string): Promise<Order | undefined> {
        try {
            await Joi.string().uuid().validateAsync(orderId);
            await Joi.string().uuid().validateAsync(userId);
            const removedOrder = await this.dbService.delete({userId, orderId});
            return removedOrder;
        } catch(e) {
            console.error(e);
        }
    }
}