import {Transform, Expose} from "class-transformer";
import { IsDefined } from "class-validator";

class novelaEspecifica {
    @Expose({name: "tipo"})
    @IsDefined({message: ()=>{ throw {status: 422, message: `El parametro es obligatorio`}}})
    @Transform(({value}) => {
        if(typeof value != "string") {
            throw {status: 500, message: "Parametros incorrectos"}
        } 
        return value
    }, {toClassOnly: true})
    tp: string 
 
    constructor (tp: string) {
        this.tp = tp
    }
}

export default novelaEspecifica; 