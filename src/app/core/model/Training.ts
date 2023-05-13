import { ITraining } from "../interfaces/ITraining";

export class Training implements ITraining{
    id?: number;
    designation?: string;

    constructor(id?: number,designation?: string) {
        this.id = id;
        this.designation = designation;
    }
}