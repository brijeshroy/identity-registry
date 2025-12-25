import { getPool } from "../db/dbConnect";

export const insertUser = async (dbQuery:string,dbParams:any[])=>{
    console.log("Inserting data into Postgres");
    const pool = await getPool();
    let id:string;
    try {
         const result = await pool.query(dbQuery, dbParams);
         console.log('Data Inserted, Output is :-',JSON.stringify(result))
         id = result.rows[0].id;
         console.log(`The id is ${id}`)
    } catch (error:unknown) {
        console.log("Error encountered while inserting data is :-",JSON.stringify(error));
        throw error;
        
    }
    return id ;
}