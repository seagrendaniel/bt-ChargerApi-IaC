import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { logError } from '../utils/logger';

const dynamoDb = new DynamoDB.DocumentClient();
const FUNCTION_NAME = 'GetAllChargers';  // Name of this Lambda function from functionName

export const handler: APIGatewayProxyHandler = async (event) => {
    try {
        const result = await dynamoDb.scan({
            TableName: process.env.CHARGERS_TABLE!
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify(result.Items),
            headers: { 'Content-Type': 'application/json' }
        };
    } catch (error: any) {
        await logError(`Error retrieving all chargers: ${error.message}`, FUNCTION_NAME);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to get chargers' }),
            headers: { 'Content-Type': 'application/json' }
        };
    }
};
