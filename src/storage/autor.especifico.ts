import {Transform, Expose} from "class-transformer";
import { IsDefined } from "class-validator";

class autorEspecifico {
    @Expose({name: "nombre"})
    @IsDefined({message: ()=>{ throw {status: 422, message: `El parametro es obligatorio`}}})
    @Transform(({value}) => {
        if(typeof value != "string") {
            throw {status: 500, message: "Parametros incorrectos"}
        } 
        return value
    }, {toClassOnly: true})
    usr: string 
 
    constructor (usr: string) {
        this.usr = usr
    }
}

export default autorEspecifico; 