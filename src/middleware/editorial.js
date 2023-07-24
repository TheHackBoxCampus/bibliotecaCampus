import "reflect-metadata";
import { plainToClass } from "class-transformer";
import editorial from "../compiled/editorial.js"
import {validate} from "class-validator";

const mdEditorial = async (req, res, next) => {
    try {
        let data = plainToClass(editorial, req.params, {excludeExtraneousValues: true}); 
        req.params = JSON.parse(JSON.stringify(data))        
        await validate(data); 
        next(); 
    }catch (err){ 
        res.send(err)
    }
}

export default mdEditorial;