export class Item{

    name: string;
    id: number;
    description: string;
    photo: Photo;

    constructor(Name: string, Id: number, Desciption: string)
    {
        this.name = Name;
        this.id = Id;
        this.description = Desciption;
    }
}
