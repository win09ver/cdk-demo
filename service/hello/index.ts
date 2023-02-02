import { APIGatewayProxyEvent } from "aws-lambda";

export const hello = async (
  event: APIGatewayProxyEvent,
  context: any,
) => {
  const isAuthorized = (event: APIGatewayProxyEvent) => {
    const group = event.requestContext.authorizer?.claims["cognito:groups"]
    console.log(group)
    if (group) {
      return (group as string).includes("admins")
    }
    return false
  }
  if (isAuthorized(event)) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    };
  }
  return {
    statusCode: 401,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify("u r not authorized"),
  };
};