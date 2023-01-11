import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Runtime} from 'aws-cdk-lib/aws-lambda'
import { join } from 'path';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { AuthorizationType, LambdaIntegration, MethodOptions, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { GenericTable } from '../infra/GenericTable'
import { AuthorizerWapper } from '../infra/AuthorizerWapper';
import { APIGatewayProxyEvent } from 'aws-lambda';
export class SpaceStack extends Stack {
  // api
  private api = new RestApi(this, 'SpaceApi')
  // cognito
  private authorizer: AuthorizerWapper
  // dynamo
  private spacesTable = new GenericTable(this, {
    tablename: "SpacesTable",
    pk: "spaceId",
    createLambdaPath: "Create",
    readLambdaPath: "Read",
    secondaryIndexes: ["location"]
  })
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    // set auth
    this.authorizer = new AuthorizerWapper(this, this.api)
    // create authorizer optionMethod fro resoucre
    const optionsWithAuth: MethodOptions = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: this.authorizer.authorizer.authorizerId
      }
    }

    // Lambda use ts
    const helloLambda = new NodejsFunction(this, 'helloLambda', {
      entry: join(__dirname, '../service/hello/index.ts'),  // lambda 関数のエントリーポイント
      handler: 'hello', // 実行する関数名
      runtime: Runtime.NODEJS_16_X,
    });
    // integrate lambda with apigetway ⇒ hello (for test)
    const helloLambdaIntergration = new LambdaIntegration(helloLambda)
    const helloResource = this.api.root.addResource('hello')
    helloResource.addMethod('GET', helloLambdaIntergration, optionsWithAuth)

    //spaces api intergrations (POST, GET, UPDATE, DELETE)
    const spaceResource = this.api.root.addResource("spaces")
    spaceResource.addMethod("POST", this.spacesTable.createLambdaIntegration)
    spaceResource.addMethod("GET", this.spacesTable.readLambdaIntegration)
     
  }
}