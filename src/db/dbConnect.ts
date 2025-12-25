import { Pool } from "pg";
import { SSMClient, GetParametersCommand } from "@aws-sdk/client-ssm";

let pool: Pool | null = null;
let cachedSSMConfig: Record<string, Record<string, string>> | null = {};

const ssmClient = new SSMClient({ region: process.env.AWS_REGION! });

export const getSSMParam = async (cacheKey: string, ssmParamArr: string[]) => {
  if (cachedSSMConfig.cacheKey) {
    console.log("SSM confiog exists", JSON.stringify(cachedSSMConfig.cacheKey));
    return cachedSSMConfig.cacheKey;
  }

  console.log("Creating New CachedSSMConfig");
  console.log("SSM Parameter keys are");
  const paramArray = ssmParamArr;
  const ssmParamSet = new GetParametersCommand({
    Names: paramArray,
    WithDecryption: true,
  });

  const ssmParamRes = await ssmClient.send(ssmParamSet);
  console.log(`The Recevied SSMParam is ${JSON.stringify(ssmParamRes)}`);

  const params: Record<string, string> = {};
  ssmParamRes.Parameters?.forEach((ele) => {
    if (ele.Name && ele.Value)
         params[ele.Name] = ele.Value;
  });
  cachedSSMConfig[cacheKey] = params;
  console.log("The SSM Param object is", JSON.stringify(params));

  return cachedSSMConfig[cacheKey];
};

export const getPool = async () => {
  if (!pool) {
    const dbSSMParam = [
      "/user-generate/db/dbname",
      "/user-generate/db/host",
      "/user-generate/db/password",
      "/user-generate/db/port",
      "/user-generate/db/username",
    ];
    const ssmParamObj = await getSSMParam("Db", dbSSMParam);
    console.log("The paramobj is", JSON.stringify(ssmParamObj));
    pool = new Pool({
      host: ssmParamObj["/user-generate/db/host"],
      user: ssmParamObj["/user-generate/db/username"],
      password: ssmParamObj["/user-generate/db/password"],
      database: ssmParamObj["/user-generate/db/dbname"],
      port: Number(ssmParamObj["/user-generate/db/port"]),
      max: 20, // Recommended for AWS Lambda
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  } else console.log("Postgres Pool Exists");

  return pool;
};
