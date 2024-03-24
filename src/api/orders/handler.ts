import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda";
import { OrdersService } from "./orders.service";
import { createResponse } from "../../helper/api/api-response";

export const createOrderHandler: Handler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if(event.body) {
        const tableName = process.env.ORDERS_TABLE!;
        const payload = JSON.parse(event.body);
        const serive = new OrdersService(tableName);
        const order = await serive.createOrder(payload);
        return createResponse(order, 201)
    }
    return createResponse(`Failed to create order`, 400);
}

export const getOrderHandler: Handler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { queryStringParameters: qsp } = event;
    if(qsp && qsp['orderId'] && qsp['userId']) {
        const {userId, orderId} = qsp;
        const tableName = process.env.ORDERS_TABLE!;
        const serive = new OrdersService(tableName);
        const order = await serive.getOrder(userId, orderId);
        return createResponse(order, 200)
    }
    return createResponse(`orderId is required in query string params`, 400);
}

export const updateOrderHandler: Handler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const qsp = event.queryStringParameters;
    if(event.body && qsp && qsp['orderId'] && qsp['userId']) {
        const tableName = process.env.ORDERS_TABLE!;
        const {orderId, userId} = qsp;
        const payload = JSON.parse(event.body);
        const serive = new OrdersService(tableName);
        const order = await serive.updateOrder(userId, orderId, payload);
        return createResponse(order, 201)
    }
    return createResponse(`Failed to update order`, 400);
}

export const deleteOrderHandler: Handler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { queryStringParameters: qsp } = event;
    if(qsp && qsp['orderId'] && qsp['userId']) {
        const tableName = process.env.ORDERS_TABLE!;
        const { orderId, userId } = qsp;
        const serive = new OrdersService(tableName);
        const order = await serive.deleteOrder(userId, orderId);
        return createResponse(order, 201)
    }
    return createResponse(`Failed to delete order`, 400);
}