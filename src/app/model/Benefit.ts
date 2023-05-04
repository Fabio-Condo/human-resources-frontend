import { IBenefit } from "../interfaces/IBenefit";

export class Benefit implements IBenefit{
    id?: number;
    designation?: string;

    constructor(id?: number,designation?: string) {
        this.id = id;
        this.designation = designation;
    }
}