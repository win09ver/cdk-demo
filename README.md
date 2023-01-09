# Welcome to your CDK TypeScript project

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


