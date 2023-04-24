import { IMainResponsibility } from "../interfaces/IMainResponsibility";

export class MainResponsibility implements IMainResponsibility{
    id?: number;
    designation?: string;

    constructor(id?: number,designation?: string) {
        this.id = id;
        this.designation = designation;
    }
}