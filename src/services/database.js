import mysql from "mysql2"; 
import dotenv from "dotenv"; 

dotenv.config(); 

const conx = mysql.createPool(JSON.parse(process.env.CONNECT));

export default conx; 