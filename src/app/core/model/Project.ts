import { IProject } from "../interfaces/IProject";
import { Department } from "./Department";
import { Employee } from "./Employee";

export class Project implements IProject{
    id?: number;
    name?: string;

    constructor(id?: number,name?: string) {
        this.id = id;
        this.name = name;
    }
}