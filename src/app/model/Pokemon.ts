import { Position } from './Position';

export class Pokemon {

    name: string;
    id: number;
    types: Array<string>;
    moves: Array<string>;
    front_default: string;
    front_shiny: string;
    back_default: string;
    back_shiny: string;
    location: Position;

    constructor(Name: string, Id: number,Types: Array<string>, Moves: Array<string>, front_default: string, front_shiny: string, back_default: string, back_shiny: string)
    {
        this.name = Name;
        this.id = Id;
        this.types = Types;
        this.moves = new Array<string>();
        for(let i =0; i<4; i++){
            this.moves.push(Moves[i]);
        }
        this.front_default = front_default;
        this.front_shiny = front_shiny;
        this.back_default = back_default;
        this.back_shiny = back_shiny;
    }
}