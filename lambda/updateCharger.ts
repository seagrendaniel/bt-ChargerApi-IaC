import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { logError } from '../utils/logger';

const dynamoDb = new DynamoDB.DocumentClient();
const FUNCTION_NAME = 'UpdateCharger';  // Name of this Lambda function from functionName

export const handler: APIGatewayProxyHandler = async (event) => {
    const id = event.pathParameters?.id;
    const data = JSON.parse(event.body || '{}');

    if (!id || !data) {
        await logError("Missing charger ID or update data", FUNCTION_NAME);
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Charger ID and update data are required" }),
            headers: { 'Content-Type': 'application/json' }
        };
    }

    try {
        const result = await dynamoDb.update({
            TableName: process.env.CHARGERS_TABLE!,
            Key: { id: parseInt(id) },
            UpdateExpression: "set #name = :n, #status = :s, #description = :d, #location = :l, #networkProtocol = :np, #publicVisibility = :pv",
            ExpressionAttributeNames: {
                "#name": "name",
                "#status": "status",
                "#description": "description",
                "#location": "location",
                "#networkProtocol": "networkProtocol",
                "#publicVisibility": "publicVisibility"
            },
            ExpressionAttributeValues: {
                ":n": data.name,
                ":s": data.status,
                ":d": data.description,
                ":l": data.location,
                ":np": data.networkProtocol,
                ":pv": data.publicVisibility
            },
            ReturnValues: "UPDATED_NEW"
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify(result.Attributes),
            headers: { 'Content-Type': 'application/json' }
        };
    } catch (error: any) {
        await logError(`Error updating charger: ${error.message}`, FUNCTION_NAME);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to update charger' }),
            headers: { 'Content-Type': 'application/json' }
        };
    }
};
