import { DynamoDB } from 'aws-sdk'
import { APIGatewayAuthorizerEvent, APIGatewayProxyResult, Context} from 'aws-lambda'
import { v4 as uuid } from 'uuid'
const dbClient = new DynamoDB.DocumentClient();

async function handler (event: any, context: Context): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: "hello from DynamoDB"  
  }
  const TABLE_NAME = process.env.TABLE_NAME
  const item = typeof event.body == 'object' ? event.body: JSON.parse(event.body)
  item.spaceId = uuid()

  try {
    await dbClient.put({
      TableName: TABLE_NAME!,
      Item: item
    }).promise()
  } catch (error: any) {
    result.body = error.message
  }

  result.body = JSON.stringify(`Created item.spaceid = ${item.spaceId}`)
  return result
}

export { handler }