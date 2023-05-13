import { ISpecificRequirement } from "../interfaces/ISpecificRequirement";

export class SpecificRequirement implements ISpecificRequirement{
    id?: number;
    designation?: string;

    constructor(id?: number,designation?: string) {
        this.id = id;
        this.designation = designation;
    }
}