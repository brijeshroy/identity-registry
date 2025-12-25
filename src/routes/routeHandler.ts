import { APIGatewayProxyEvent } from "aws-lambda"
import { userInfo } from "../interfaces/userInfo-Interface";
import { validateReqPayload } from "../validators/userPayloadValidation";
import { createDbPayload } from "../helpers/create-db-payload-helper";
import { passwordHasher } from "../helpers/password-hasher-helper";
import { insertUser } from "../services/create-user-service";
import { emailQInsert } from "../services/queue-email-service";


export class RouteHandler {

    userCreate = async (event: APIGatewayProxyEvent): Promise<any> => {
        let dbRes;
        try {
            console.log("Before parsing");
            console.log(JSON.stringify(event))
            console.log("Before parsing 1");
            console.log(JSON.stringify(event.body))
            const userPayload: userInfo = JSON.parse(event?.body || '');
            userPayload.category = userPayload.category.toUpperCase()


            validateReqPayload(userPayload)

            const hashedPassword = await passwordHasher(userPayload.password)
            userPayload.password = hashedPassword;
            const { dbQuery, dbParams } = createDbPayload(userPayload)


            dbRes = await insertUser(dbQuery, dbParams)
            console.log(`Data inserted response is ${JSON.stringify(dbRes)}`)
            const {password , ...userDetails } = userPayload
           await emailQInsert(userDetails,dbRes)

        } catch (error) {
            console.log("Error encountered is :-", error);
            throw error
        }
        return {
            statusCode: 201,
            body: JSON.stringify({
                message: "User created successfully",
                userId: dbRes
            })
        }


    }
}