import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { logError } from '../utils/logger';

const dynamoDb = new DynamoDB.DocumentClient();
const FUNCTION_NAME = 'DeleteCharger'; // Name of this Lambda function from functionName

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
        await dynamoDb.delete({
            TableName: process.env.CHARGERS_TABLE!,
            Key: { id: parseInt(id) }
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Charger deleted successfully' }),
            headers: { 'Content-Type': 'application/json' }
        };
    } catch (error: any) {
        await logError(`Error deleting charger: ${error.message}`, FUNCTION_NAME);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to delete charger' }),
            headers: { 'Content-Type': 'application/json' }
        };
    }
};
