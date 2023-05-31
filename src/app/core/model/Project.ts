import { IProject } from "../interfaces/IProject";
import { Department } from "./Department";
import { Employee } from "./Employee";

export class Project implements IProject{
    id?: number;
    name?: string;
    responsibleEmployee = new Employee

    constructor(id?: number,name?: string, responsibleEmployee = new Employee) {
        this.id = id;
        this.name = name;
        this.responsibleEmployee = responsibleEmployee;
    }
}