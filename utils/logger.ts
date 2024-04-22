import * as fs from 'fs';
import { CloudWatchLogs } from 'aws-sdk';

const cloudWatchLogs = new CloudWatchLogs();
const logFilePath = '../error.log'; // Local error log file path

export const logError = async (errMsg: string, functionName: string) => {
  try {
    // Log the error message to CloudWatch Logs
    await logToCloudWatchLogs(errMsg, functionName);

    // Log the error message to local error log file
    logToLocalFile(errMsg);
  } catch (error) {
    console.error('Error logging:', error);
  }
};

async function logToCloudWatchLogs(errMsg: string, functionName: string) {
  const logGroupName = `/aws/lambda/${functionName}` // Replace with your Lambda function's log group name
  const logStreamName = `${functionName}-${new Date().toISOString().slice(0, 10)}`; // Daily log stream
  await cloudWatchLogs.putLogEvents({
    logGroupName: logGroupName,
    logStreamName: logStreamName,
    logEvents: [
      {
        message: errMsg,
        timestamp: new Date().getTime(),
      },
    ],
  }).promise();
}

function logToLocalFile(errMsg: string) {
  // Log the error message to local error log file
  const logMessage = `${new Date().toISOString()}: ${errMsg}\n`;

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('Error logging to local file:', err);
    }
  });
}
