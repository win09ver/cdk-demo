import { CfnOutput } from "aws-cdk-lib";
import { CognitoUserPoolsAuthorizer, RestApi } from "aws-cdk-lib/aws-apigateway";
import { CfnUserPoolGroup, UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";


export class AuthorizerWapper {
  private scope: Construct
  private api: RestApi

  private userPool: UserPool
  private userPoolClient: UserPoolClient
  public authorizer:CognitoUserPoolsAuthorizer

  constructor(scope: Construct, api: RestApi) {
    this.scope = scope
    this.api = api
    this.init()
  }

  private init() {
    this.createUserPool()
    this.addUserPoolClient()
    this.createAuthorizer()
    this.createAdminsGroups()
  }

  private createUserPool() {
    this.userPool = new UserPool(this.scope, "SpaceUserPool", {
      userPoolName: "SpaceUserPool",
      selfSignUpEnabled: true,
      signInAliases: {
        username: true,
        email: true
      }
    })

    // console.log userpoolid
    new CfnOutput(this.scope, "UserPoolId", {
      value: this.userPool.userPoolId
    })
  }

  private addUserPoolClient() {
    this.userPoolClient = this.userPool.addClient("SpaceUserPool-client", {
      userPoolClientName: "SpaceUserPool-client",
      authFlows: {
        adminUserPassword: true,
        custom: true,
        userPassword: true,
        userSrp: true
      },
      generateSecret: false
    })
    // console.log userpoolid
    new CfnOutput(this.scope, "UserPoolClientId", {
      value: this.userPoolClient.userPoolClientId
    })
  }

  private createAuthorizer() {
    this.authorizer = new CognitoUserPoolsAuthorizer(this.scope, "SpaceUserAuthorizer", {
      cognitoUserPools: [this.userPool],
      authorizerName: "SpaceUserAuthorizer",
      identitySource: "method.request.header.Authorization"
    })
    this.authorizer._attachToApi(this.api)
  }

  private createAdminsGroups() {
    new CfnUserPoolGroup(this.scope, "admina", {
      groupName: "admins",
      userPoolId: this.userPool.userPoolId
    })
  }
}