import { APIGatewayProxyEvent } from 'aws-lambda'
import { APIGateway } from 'aws-sdk'
import {handler} from '../../service/SpacesTable/Read'

const event: APIGatewayProxyEvent = {
  queryStringParameters: {
    spaceId: "e674d333-1420-4afd-8085-070db67f3269"
  } 
} as any
const result = handler(event, {} as any).then(resp => {
  const item = resp.body
  console.log("resq body", item)
})

