# Welcome to your CDK TypeScript project
# study use Google 「Code with AWS and Typescript by creating serverless projects with CDK, CloudFormation, Cognito, Lambda and AWS Amplify」
# Thanks udemy

You should explore the contents of this project. It demonstrates a CDK app with an instance of a stack (`CdkDemoStack`)
which contains an Amazon SQS queue that is subscribed to an Amazon SNS topic.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
   cdk deploy --parameters <var>=8

* `cdk synth`       emits the synthesized CloudFormation template

* `cdk list`       list all stacks
* `cdk diff`        compare deployed stack with current state
* `cdk destroy <stackname>`       delete stack
* `cdk doctor`       env check

## API refe rence
https://docs.aws.amazon.com/cdk/api/v2/docs/aws-construct-library.html


## set up
#lambda types
yarn add @types/aws-lambda

#compile ts to js locally
yarn add --dev esbuild@0

#install sdk to get info from aws
yarn add aws-sdk

#debugger
.vscode/
  - launch.json 
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug local file",
      "runtimeArgs": ["-r", "ts-node/register"],
      "args": ["${relativeFile}"],
      "env": {
        "AWS_REGION": "ap-northeast-1"
      },
      "program": "${file}"
    }
  ]
}
```
#install amplify for auth
yarn add aws-amplify @aws-amplify/auth

## cognito memo
pool-id: ap-northeast-1_CCAUAO7e0

domain name: doublepann

add client name: my-add-client/ id: 124oegljasu7smhjcd2vbqjca9

add user

#confirmed pw
aws cognito-idp admin-set-user-password --user-pool-id ap-northeast-1_iQFKr2JKM --username doublepann --password "******" --permanent