import "reflect-metadata";
import { plainToClass } from "class-transformer";
import libroEspecifico from "../compiled/libro.especifico.js"
import {validate} from "class-validator";

const mdLibroEspecifico = async (req, res, next) => {
    try {
        console.log(req.params)
        let data = plainToClass(libroEspecifico, req.params, {excludeExtraneousValues: true}); 
        req.params = JSON.parse(JSON.stringify(data))        
        await validate(data); 
        next(); 
    }catch (err){ 
        res.send(err)
    }
}

export default mdLibroEspecifico;