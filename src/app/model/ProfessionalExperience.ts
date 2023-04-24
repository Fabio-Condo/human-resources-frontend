import { IProfessionalExperience } from "../interfaces/IProfessionalExperience";

export class ProfessionalExperience implements IProfessionalExperience{
    id?: number;
    designation?: string;

    constructor(id?: number,designation?: string) {
        this.id = id;
        this.designation = designation;
    }
}