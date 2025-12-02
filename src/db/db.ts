import {Pool} from "pg";

let pool : Pool | null = null


export const getPool = ()=>{
    if (!pool){
        pool = new Pool({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          port: Number(process.env.DB_PORT),
          max: 20,                   // Recommended for AWS Lambda
          idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
     ssl: {
  rejectUnauthorized: false
}
        })
        console.log("Postgres Pool Created")
        console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD); // TEMPORARY
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_PORT:", process.env.DB_PORT);
    }
    else
        console.log("Postgres Pool Exists")

    return pool;
}