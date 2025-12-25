import { Pool } from "pg";
import { SSMClient, GetParametersCommand } from "@aws-sdk/client-ssm";

let pool: Pool | null = null;
let cachedSSMConfig: Record<string, string> | null = null;

const ssmClient = new SSMClient({ region: process.env.AWS_REGION! });

const getSSMParam = async () => {
    if (cachedSSMConfig) {
        console.log("SSM confiog exists", JSON.stringify(cachedSSMConfig))
        return cachedSSMConfig
    }

    console.log("Creating New CachedSSMConfig")
    const paramArray = [
        "/user-generate/db/dbname",
        "/user-generate/db/host",
        "/user-generate/db/password",
        "/user-generate/db/port",
        "/user-generate/db/username"
    ]
    const ssmParamSet = new GetParametersCommand({
        Names: paramArray,
        WithDecryption: true
    })

    const ssmParamRes = await ssmClient.send(ssmParamSet)
    console.log(`The Recevied SSMParam is ${JSON.stringify(ssmParamRes)}`)



    const params: Record<string, string> = {}
    ssmParamRes.Parameters?.forEach(ele => {
        if (ele.Name && ele.Value)
            params[ele.Name] = ele.Value
    })
    console.log("The SSM Param object is", JSON.stringify(params))
    cachedSSMConfig = params

    return cachedSSMConfig;

}




export const getPool = async () => {
    if (!pool) {
        const ssmParamObj = await getSSMParam()
        console.log("The paramobj is", JSON.stringify(ssmParamObj))
        pool = new Pool({
            host: ssmParamObj["/user-generate/db/host"],
            user: ssmParamObj["/user-generate/db/username"],
            password: ssmParamObj["/user-generate/db/password"],
            database: ssmParamObj["/user-generate/db/dbname"],
            port: Number(ssmParamObj["/user-generate/db/port"]),
            max: 20,                   // Recommended for AWS Lambda
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
            ssl: {
                rejectUnauthorized: false
            }
        })

    }
    else
        console.log("Postgres Pool Exists")

    return pool;
}