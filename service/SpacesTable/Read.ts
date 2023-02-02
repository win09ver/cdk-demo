import { DynamoDB } from 'aws-sdk'
import { APIGatewayAuthorizerEvent, APIGatewayProxyEvent, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResult, Context} from 'aws-lambda'
import { TARGET_PARTITIONS } from 'aws-cdk-lib/cx-api';
const dbClient = new DynamoDB.DocumentClient();
// env
const TABLE_NAME = process.env.TABLE_NAME
const PK = process.env.PRIMARY_KEY

async function handler (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: "hello from DynamoDB"  
  }


  try {
    const {queryStringParameters} = event
    if (queryStringParameters) {
      if (PK! in queryStringParameters) {
        result.body = await querWithPk(queryStringParameters)
      } else {
        result.body = await querWithSecPk(queryStringParameters)
      }
    } else {
      result.body = await scanTable()
    }
  
  } catch (error: any) {
    result.body = error.message
  }
  return result
}

// scan function
async function scanTable() {
  const queryResp = await dbClient.scan({
    TableName: TABLE_NAME!
  }).promise();
  return JSON.stringify(queryResp)
}

// scan query with PK
async function querWithPk(queryParams: APIGatewayProxyEventQueryStringParameters) {
  const keyValue = queryParams[PK!]
  const resp = await dbClient.query({
    TableName: TABLE_NAME!,
    KeyConditionExpression: '#spaceId = :spaceId',
    ExpressionAttributeNames: {
      '#spaceId': PK!
    },
    ExpressionAttributeValues: {
      ':spaceId': keyValue
    }
  }).promise()
  return JSON.stringify(resp)
}

// scan query with sec PK
async function querWithSecPk(queryParams: APIGatewayProxyEventQueryStringParameters) {
  const queryKey = Object.keys(queryParams)[0]
  const queryValue = queryParams[queryKey]
  const resp = await dbClient.query({
    TableName: TABLE_NAME!,
    IndexName: queryKey,
    KeyConditionExpression: '#queryKey = :queryKey',
    ExpressionAttributeNames: {
      '#queryKey': queryKey!
    },
    ExpressionAttributeValues: {
      ':queryKey': queryValue
    }
  }).promise()
  return JSON.stringify(resp)
}

export { handler }