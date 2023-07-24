import "reflect-metadata";
import { plainToClass } from "class-transformer";
import novelaEspecifica from "../compiled/novela.especifica.js"
import {validate} from "class-validator";

const mdNovelaEspecifico = async (req, res, next) => {
    try {
        let data = plainToClass(novelaEspecifica, req.params, {excludeExtraneousValues: true}); 
        req.params = JSON.parse(JSON.stringify(data))        
        await validate(data); 
        next(); 
    }catch (err){ 
        res.send(err)
    }
}

export default mdNovelaEspecifico;