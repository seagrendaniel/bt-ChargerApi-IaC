import { CloudWatchLogs } from 'aws-sdk';

const cloudWatch = new CloudWatchLogs();

async function ensureLogStream(logGroupName: string, logStreamName: string) {
    try {
        await cloudWatch.createLogStream({
            logGroupName,
            logStreamName
        }).promise();
    } catch (error: any) {
        if (error.code !== 'ResourceAlreadyExistsException') {
            throw error;
        }
        // If the stream already exists, do nothing
    }
}

export async function logError(errorMessage: string, functionName: string) {
    const logGroupName = `/aws/lambda/${functionName}`;
    const logStreamName = `${functionName}`;

    await ensureLogStream(logGroupName, logStreamName);

    const params = {
        logGroupName,
        logStreamName,
        logEvents: [
            {
                message: errorMessage,
                timestamp: Date.now()
            }
        ]
    };

    try {
        await cloudWatch.putLogEvents(params).promise();
    } catch (error) {
        console.error('Failed to log to CloudWatch:', error);
    }
}
