import {Transform, Expose} from "class-transformer";
import { IsDefined } from "class-validator";

class libroEspecifico {
    @Expose({name: "persona"})
    @IsDefined({message: ()=>{ throw {status: 422, message: `El parametro es obligatorio`}}})
    @Transform(({value}) => {
        if(typeof value != "string") {
            throw {status: 500, message: "Parametros incorrectos"}
        } 
        return value
    }, {toClassOnly: true})
    per: string 
 
    constructor (per: string) {
        this.per = per
    }
}

export default libroEspecifico; 