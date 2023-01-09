import { CfnOutput, CfnParameter, Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct, Node } from 'constructs';
import { Code, Function as LambdaFunction, Runtime} from 'aws-cdk-lib/aws-lambda'
import { join } from 'path';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export class CdkDemoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // const helloLambda = new LambdaFunction(this, 'helloLambda', {
    //   runtime: Runtime.NODEJS_16_X,
    //   code: Code.fromAsset(join(__dirname, '../service/hello')),
    //   handler: 'hello.main'
    // })

  // Lambda
   const helloLambda = new NodejsFunction(this, 'helloLambda', {
     entry: join(__dirname, '../service/hello/index.ts'),  // lambda 関数のエントリーポイント
     handler: 'handler', // 実行する関数名
     runtime: Runtime.NODEJS_16_X,
   });
  }
}
