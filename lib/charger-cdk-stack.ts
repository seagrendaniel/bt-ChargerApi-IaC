import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodeJs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as iam from 'aws-cdk-lib/aws-iam'


export class ChargerApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Table
    const chargerTable = new dynamodb.Table(this, 'ChargersTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.NUMBER },
      tableName: 'Chargers',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    const lambdaExecutionRole = new iam.Role(this, 'LambdaExecutionRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
      ],
    });
    

    // Lambda Functions
    const createChargerLambda = new lambdaNodeJs.NodejsFunction(this, 'CreateChargerHandler', {
      entry: 'lambda/createCharger.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_16_X,
      functionName: 'CreateChargerFunction',
      role: lambdaExecutionRole,
      environment: {
        CHARGERS_TABLE: chargerTable.tableName
      }
    });

    const getChargerLambda = new lambdaNodeJs.NodejsFunction(this, 'GetChargerHandler', {
      entry: 'lambda/getCharger.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_16_X,
      functionName: 'GetChargerFunction',
      role: lambdaExecutionRole,
      environment: {
        CHARGERS_TABLE: chargerTable.tableName
       }
    });

    const updateChargerLambda = new lambdaNodeJs.NodejsFunction(this, 'UpdateChargerHandler', {
      entry: 'lambda/updateCharger.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_16_X,
      functionName: 'UpdateChargerFunction',
      role: lambdaExecutionRole,
      environment: {
        CHARGERS_TABLE: chargerTable.tableName
      }
    });

    const deleteChargerLambda = new lambdaNodeJs.NodejsFunction(this, 'DeleteChargerHandler', {
      entry: 'lambda/deleteCharger.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_16_X,
      functionName: 'DeleteChargerFunction',
      role: lambdaExecutionRole,
      environment: {
        CHARGERS_TABLE: chargerTable.tableName
      }
    });

    const getAllChargersLambda = new lambdaNodeJs.NodejsFunction(this, 'GetAllChargersHandler', {
      entry: 'lambda/getAllChargers.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_16_X,
      functionName: 'GetAllChargersFunction',
      role: lambdaExecutionRole,
      environment: {
        CHARGERS_TABLE: chargerTable.tableName
      }
    });

    // API Gateway
    const api = new apigateway.RestApi(this, 'ChargersAPI', {
      restApiName: 'Charger Service',
      description: 'This service handles CRUD operations on chargers.'
    });

    const chargers = api.root.addResource('chargers');
    chargers.addMethod('POST', new apigateway.LambdaIntegration(createChargerLambda), { apiKeyRequired: true });
    chargers.addMethod('GET', new apigateway.LambdaIntegration(getAllChargersLambda));

    const charger = chargers.addResource('{id}');
    charger.addMethod('GET', new apigateway.LambdaIntegration(getChargerLambda));
    charger.addMethod('PUT', new apigateway.LambdaIntegration(updateChargerLambda), { apiKeyRequired: true });
    charger.addMethod('DELETE', new apigateway.LambdaIntegration(deleteChargerLambda), { apiKeyRequired: true });

 
    // DB Permissions
    chargerTable.grantReadWriteData(createChargerLambda);
    chargerTable.grantReadData(getChargerLambda);
    chargerTable.grantReadWriteData(updateChargerLambda);
    chargerTable.grantReadWriteData(deleteChargerLambda);
    chargerTable.grantReadData(getAllChargersLambda);

    // Setup API key and usage plan
    // API Key and Usage Plan
    // Create an API Key
    const apiKey = new apigateway.ApiKey(this, 'ApiKey', {
      apiKeyName: 'HardcodedApiKey',
      description: 'API Key for accessing certain methods',
      enabled: true,
    });
    const usagePlan = new apigateway.UsagePlan(this, 'UsagePlan', {
      name: 'BasicUsage',
      throttle: {
        rateLimit: 10,
        burstLimit: 2
      }
    });

    usagePlan.addApiKey(apiKey);
    usagePlan.addApiStage({
      stage: api.deploymentStage,
      api: api
    });

  }
}
