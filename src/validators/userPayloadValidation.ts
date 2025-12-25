import { userInfo } from "../interfaces/userInfo-Interface"
import { USER_INFO_SCHEMA } from "../schemas/userInfo"

export const validateReqPayload=(userPayload:userInfo)=>{

    const {error,value} = USER_INFO_SCHEMA.validate(userPayload,{abortEarly:false})

  

    if(error)
    {
        throw new Error(JSON.stringify(error.details))
    }

      console.log(value)



}