import { APIGatewayProxyResult } from "aws-lambda"

export const createResponse = (payload: any, status = 200): APIGatewayProxyResult => {
    return {
        statusCode: status,
        body: JSON.stringify(payload),
    }
}