import { UserCategoryKey } from "../constants/project-constants";
import { userInfo } from "../interfaces/userInfo-Interface";
import {idCreator} from "./id-creator-helper"

export const createDbPayload = (userPayload:userInfo)=>{
    const {name,email,password,category} = userPayload
    console.log("the body is ",JSON.stringify(userPayload))
    const id = idCreator(category as UserCategoryKey)

    const dbQuery = `INSERT into user_registry (id,name,email,password,category) 
                     values ($1,$2,$3,$4,$5) RETURNING id;`
    const dbParams = [id,name,email,password,category]

    console.log('The query is :- ',dbQuery);
    console.log("The Params are",dbParams)

    return {dbQuery,dbParams}
}