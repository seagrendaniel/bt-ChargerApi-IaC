import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { logError } from '../utils/logger';

const dynamoDb = new DynamoDB.DocumentClient();
const CHARGERS_TABLE = process.env.CHARGERS_TABLE!;
const FUNCTION_NAME = 'CreateChargerFunction'; // Name of this Lambda function from functionName

export const handler: APIGatewayProxyHandler = async (event) => {
  let data;

  try {
      data = JSON.parse(event.body || '{}');
  } catch (parseError) {
      await logError("Failed to parse JSON input.", FUNCTION_NAME);
      return {
          statusCode: 400,
          body: JSON.stringify({ message: "Invalid JSON input" }),
          headers: { 'Content-Type': 'application/json' }
      };
  }

  if (!data.name || !data.status || !data.location) {
    await logError("Missing parameters in request data", FUNCTION_NAME);
    return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing parameters" }),
        headers: { 'Content-Type': 'application/json' }
    };
}

    // Prepare the item to insert in DynamoDB
    const item = {
        TableName: CHARGERS_TABLE, // The table name from environment variables
        Item: {
            id: data.id || Date.now(), 
            name: data.name || '',
            description: data.description,
            status: data.status,
            location: data.location,
            networkProtocol: data.networkProtocol,
            publicVisibility: data.publicVisibility
        },
    };

    try {
        await dynamoDb.put(item).promise();
        return {
            statusCode: 201,
            body: JSON.stringify(item.Item),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    } catch (error: any) {
        await logError(`Error creating charger: ${error.message}`, FUNCTION_NAME);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Could not create charger' }),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    }
};
