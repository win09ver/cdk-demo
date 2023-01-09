import { CfnOutput, CfnParameter, Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class CdkDemoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const duration = new CfnParameter(this, 'duration', {
      type: "Number",
      default: 5,
      minValue: 2,
      maxValue: 7
    })
    const myBucket = new s3.Bucket(this, 'somebucket', {
      lifecycleRules: [
        {
          expiration: Duration.days(duration.valueAsNumber)
        }
      ]
    })

    // see outputs
    new CfnOutput(this, "mybucket", {
      value: myBucket.bucketName
    })


  }
}
