import { Stack } from "aws-cdk-lib"
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway"
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb"
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs"
import { join } from "path"
import { handler } from "../service/SpacesTable/Create"

export interface TableProps {
  tablename: string,
  pk: string
  createLambdaPath?: string,
  readLambdaPath?: string,
  updateLambdaPath?: string,
  deleteLambdaPath?: string,
  secondaryIndexes?: string[],
}

export class GenericTable {
  private props: TableProps
  private stack: Stack
  private table: Table

  private createLambda: NodejsFunction
  private readLambda: NodejsFunction
  private updateLambda: NodejsFunction
  private deleteLambda: NodejsFunction

  public createLambdaIntegration: LambdaIntegration
  public readLambdaIntegration: LambdaIntegration
  public updateLambdaIntegration: LambdaIntegration
  public deleteLambdaIntegration: LambdaIntegration

  public constructor(stack:Stack, props: TableProps) {
    this.props = props
    this.stack = stack
    this.init()
  }

  private init() {
    this.createTable()
    this.addSecIndexs()
    this.createLambdas()
    this.grantTableRight()
  }

  private createTable() {
    this.table = new Table(this.stack, this.props.tablename, {
      partitionKey: {
        name: this.props.pk,
        type: AttributeType.STRING
      },

      tableName: this.props.tablename
    })
  }

  private addSecIndexs() {
    const secondaryIndexes = this.props.secondaryIndexes
    if (secondaryIndexes) {
      secondaryIndexes.forEach(index => {
        this.table.addGlobalSecondaryIndex({
          indexName: index,
          partitionKey: {
            name: index,
            type: AttributeType.STRING
          }
        })
      })
    }
  }

  private createLambdas() {
    const createPath = this.props.createLambdaPath
    const readPath = this.props.readLambdaPath
    const updatePath = this.props.updateLambdaPath
    const deletePath = this.props.deleteLambdaPath
    if (createPath) {
      this.createLambda = this.createSingleLambda(createPath)
      this.createLambdaIntegration = new LambdaIntegration(this.createLambda)
    }
    if (readPath) {
      this.readLambda = this.createSingleLambda(readPath)
      this.readLambdaIntegration = new LambdaIntegration(this.readLambda)

    }
    if (updatePath) {
      this.updateLambda = this.createSingleLambda(updatePath)
      this.updateLambdaIntegration = new LambdaIntegration(this.updateLambda)

    }
    if (deletePath) {
      this.deleteLambda = this.createSingleLambda(deletePath)
      this.deleteLambdaIntegration = new LambdaIntegration(this.deleteLambda)
    }
  }

  private grantTableRight() {
    if (this.readLambda) {
      this.table.grantReadData(this.readLambda)
    }
    const writeRigth = this.createLambda || this.updateLambda || this.deleteLambda
    if (writeRigth) {
      this.table.grantWriteData(writeRigth)
    }
  }

  private createSingleLambda(lambdaPath: string): NodejsFunction {
    const lambdaId = this.props.tablename + lambdaPath
    return new NodejsFunction(this.stack, lambdaId, {
      entry: join(__dirname, "../service/", this.props.tablename, `${lambdaPath}.ts`),
      handler: "handler",
      functionName: lambdaId,
      environment: {
        TABLE_NAME: this.props.tablename,
        PRIMARY_KEY: this.props.pk
      }
      
    })
  }
}