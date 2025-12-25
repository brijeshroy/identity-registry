import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import{ RouteHandler }from "./routes/routeHandler"

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  let statusCode = 404;
  let Res : any= { message: "Route not found Here,Please retry" }
  try {
   const routehandler = new RouteHandler();
    console.log("Entered in lambda");
    if(event.path.includes("createUser") && event.httpMethod === "POST")
      Res =await  routehandler.userCreate(event)


       
     

  
  } catch (error: unknown) {
    console.log(`Error is ${error}`)
    statusCode = 400
      let errMsg = "Unknown"
    if (error instanceof Error)
      errMsg = error.message
    Res = {
    statusCode : 400,
    body : JSON.stringify({
      message:"Process failed",
      error : errMsg
    })
    }
 
  }
     return Res;
};