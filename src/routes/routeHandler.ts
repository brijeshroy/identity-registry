import { APIGatewayProxyEvent } from "aws-lambda"
import { userInfo } from "../interfaces/userInfo-Interface";
import { validateReqPayload } from "../validators/userPayloadValidation";
import { createDbPayload } from "../helpers/create-db-payload-helper";
import { passwordHasher } from "../helpers/password-hasher-helper";
import { insertUser } from "../services/db-service";


export class RouteHandler {

    userCreate = async (event: APIGatewayProxyEvent) : Promise<any>=> {
        let dbRes;
        try {
            const userPayload: userInfo = JSON.parse(event?.body || '');
            userPayload.category = userPayload.category.toUpperCase()


            validateReqPayload(userPayload)

            const hashedPassword = await passwordHasher(userPayload.password)
            userPayload.password = hashedPassword;
            const { dbQuery, dbParams } = createDbPayload(userPayload)


             dbRes = await insertUser(dbQuery, dbParams)
            console.log(`Data inserted response is ${JSON.stringify(dbRes)}`)
       
        } catch (error) {
            console.log("Error encountered is :-", error);
            throw error
        }
          return dbRes;
        

    }
}