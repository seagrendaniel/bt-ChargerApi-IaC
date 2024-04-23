import {Charger} from '../models/interfaces'

import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event) => {
    let data: Charger[];
    try {
        data = JSON.parse(event.body || '[]');
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid JSON input' }),
            headers: { 'Content-Type': 'application/json' }
        };
    }

    const items = data.map(item => ({
        PutRequest: {
            Item: item
        }
    }));

    const params = {
        RequestItems: {
            'Chargers': items 
        }
    };

    try {
        const result = await dynamoDb.batchWrite(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(result),
            headers: { 'Content-Type': 'application/json' }
        };
    } catch (error: any) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to insert items', error: error.message }),
            headers: { 'Content-Type': 'application/json' }
        };
    }
};
