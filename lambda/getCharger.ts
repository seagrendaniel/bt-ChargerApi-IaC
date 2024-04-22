import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { logError } from '../utils/logger';

const dynamoDb = new DynamoDB.DocumentClient();
const FUNCTION_NAME = 'GetChargerFunction';  // Name of this Lambda function from functionName

export const handler: APIGatewayProxyHandler = async (event) => {
    const id = event.pathParameters?.id;

    if (!id) {
        await logError("Missing charger ID", FUNCTION_NAME);
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Charger ID is required" }),
            headers: { 'Content-Type': 'application/json' }
        };
    }

    try {
        const result = await dynamoDb.get({
            TableName: process.env.CHARGERS_TABLE!,
            Key: { id: parseInt(id) },
        }).promise();

        if (!result.Item) {
            await logError("Charger not found", FUNCTION_NAME);
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Charger not found' }),
                headers: { 'Content-Type': 'application/json' }
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(result.Item),
            headers: { 'Content-Type': 'application/json' }
        };
    } catch (error: any) {
        await logError(`Error retrieving charger: ${error.message}`, FUNCTION_NAME);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to retrieve charger' }),
            headers: { 'Content-Type': 'application/json' }
        };
    }
};
