import "reflect-metadata";
import { plainToClass } from "class-transformer";
import autorEspecifico from "../compiled/autor.especifico.js"
import {validate} from "class-validator";

const mdAutorEspecifico = async (req, res, next) => {
    try {
        let data = plainToClass(autorEspecifico, req.params, {excludeExtraneousValues: true}); 
        req.params = JSON.parse(JSON.stringify(data))        
        await validate(data); 
        next(); 
    }catch (err){ 
        res.send(err)
    }
}

export default mdAutorEspecifico;