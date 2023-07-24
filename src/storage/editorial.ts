import {Transform, Expose} from "class-transformer";
import { IsDefined } from "class-validator";

class editorial {
    @Expose({name: "editorial"})
    @IsDefined({message: ()=>{ throw {status: 422, message: `El parametro es obligatorio`}}})
    @Transform(({value}) => {
        if(typeof value != "string") {
            throw {status: 500, message: "Parametros incorrectos"}
        } 
        return value
    }, {toClassOnly: true})
    ed: string 
 
    constructor (ed: string) {
        this.ed = ed
    }
}

export default editorial;