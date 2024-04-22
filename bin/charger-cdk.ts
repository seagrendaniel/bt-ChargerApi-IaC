#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ChargerApiStack } from '../lib/charger-cdk-stack';

const app = new cdk.App();
new ChargerApiStack(app, 'ChargerApiStack', {
  env: {
    region: 'us-east-2',
    account: process.env.CDK_DEFAULT_ACCOUNT
  }
});

app.synth()