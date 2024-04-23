import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event) => {
    if (!event.body) {
        console.error('Error: No request body provided');
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Request body is empty" }),
            headers: { 'Content-Type': 'application/json' }
        };
    }

    let data;
    try {
        data = JSON.parse(event.body);
    } catch (parseError) {
        console.error('Error parsing JSON input:', parseError);
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Invalid JSON input" }),
            headers: { 'Content-Type': 'application/json' }
        };
    }

    // Check and ensure that the CHARGERS_TABLE environment variable is defined
    const tableName = process.env.CHARGERS_TABLE;
    if (!tableName) {
        console.error('CHARGERS_TABLE environment variable is not set.');
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Server configuration error" }),
            headers: { 'Content-Type': 'application/json' }
        };
    }

    const id = event.pathParameters?.id;
    if (!id) {
        console.error('Error: No ID provided');
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "ID parameter is required" }),
            headers: { 'Content-Type': 'application/json' }
        };
    }

    // Setup the update parameters
    const params = {
        TableName: tableName,
        Key: { id: parseInt(id) },
        UpdateExpression: "set #name = :n, #description = :d, #status = :s, #location = :l, #networkProtocol = :np, #publicVisibility = :pv",
        ExpressionAttributeNames: {
            "#name": "name",
            "#description": "description",
            "#status": "status",
            "#location": "location",
            "#networkProtocol": "networkProtocol",
            "#publicVisibility": "publicVisibility"
        },
        ExpressionAttributeValues: {
            ":n": data.name,
            ":d": data.description,
            ":s": data.status,
            ":l": data.location,
            ":np": data.networkProtocol,
            ":pv": data.publicVisibility
        },
        ReturnValues: "UPDATED_NEW"
    };

    try {
        const result = await dynamoDb.update(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(result.Attributes),
            headers: { 'Content-Type': 'application/json' }
        };
    } catch (error: any) {
        console.error(`Error updating charger: ${error.message}`, error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to update charger' }),
            headers: { 'Content-Type': 'application/json' }
        };
    }
};
