import express from "express"
import app from "./app.js";
import dotenv from "dotenv"; 
import router from "./router/biblioteca.router.js";

dotenv.config(); 

let $server = JSON.parse(process.env.SERVER);

app.use(express.json());
app.use(express.text()); 

app.use("/biblioteca", router); 

app.listen($server, () => {
    console.log(`listening http://${$server.hostname}:${$server.port}`)
})