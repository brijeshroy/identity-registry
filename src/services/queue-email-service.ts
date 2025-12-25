import { SendMessageCommand , SQSClient } from "@aws-sdk/client-sqs";
import {getSSMParam} from "../db/dbConnect"


export const sqsClient = new SQSClient({region : process.env.AWS_REGION!})

export const emailQInsert = async (userDetails : any , userId :  string) =>{

    const msgBody = {
    eventType: "USER_CREATED",
    userId: userId,              
    email: userDetails.email,      // from request
    data: {
      name: userDetails.name,
      category: userDetails.category,
    },
  };

  console.log("The message being send to SQS is",JSON.stringify(msgBody))
  const ssmParam = ["/user/email-SQS-url"]
  const sqsEmailUrl = await getSSMParam("Email",ssmParam) 
  console.log(`The Url is ${sqsEmailUrl}`);
  try{
  await sqsClient.send( 
    new SendMessageCommand({
        QueueUrl : sqsEmailUrl["/user/email-SQS-url"],
        MessageBody : JSON.stringify(msgBody)
    })
  )
}
catch ( err)
{
    console.log("SQS queue sending failed", JSON.stringify(err))
  
}
}