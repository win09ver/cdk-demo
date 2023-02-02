import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Runtime} from 'aws-cdk-lib/aws-lambda'
import { join } from 'path';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';

export class CdkDemoStack extends Stack {

  private api = new RestApi(this, 'SpaceApi')
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    // Lambda use ts
    const helloLambda = new NodejsFunction(this, 'helloLambda', {
      entry: join(__dirname, '../service/hello/index.ts'),  // lambda 関数のエントリーポイント
      handler: 'hello', // 実行する関数名
      runtime: Runtime.NODEJS_16_X,
    });

    // integrate lambda with apigetway
    const helloLambdaIntergration = new LambdaIntegration(helloLambda)
    const helloResource = this.api.root.addResource('hello')
    helloResource.addMethod('GET', helloLambdaIntergration)
  }
}
