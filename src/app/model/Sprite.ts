export class Sprite {
    
    front_default: String;
    front_shiny: String;
    back_default: String;
    back_shiny: String;

    constructor(front_default: String, front_shiny: String, back_default: String, back_shiny: String){
        this.front_default = front_default
        this.front_shiny = front_shiny
        this.back_default = back_default
        this.back_shiny = back_shiny
    }
}