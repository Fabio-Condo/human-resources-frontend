import { IProject } from "../interfaces/IProject";
import { Department } from "./Department";

export class Project implements IProject{
    id?: number;
    name?: string;
    department = new Department;

    constructor(id?: number,name?: string, department = new Department) {
        this.id = id;
        this.name = name;
        this.department = department;
    }
}