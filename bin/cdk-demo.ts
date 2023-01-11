#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { SpaceStack } from '../lib/SpaceStack';

const app = new cdk.App();
// new CdkDemoStack(app, 'CdkDemoStack');
new SpaceStack(app, 'SpaceStack')

