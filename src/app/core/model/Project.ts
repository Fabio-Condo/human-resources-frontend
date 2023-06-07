import { IProject } from "../interfaces/IProject";
import { Department } from "./Department";
import { Employee } from "./Employee";

export class Project implements IProject{
    id!: number;
    name!: string;
    projectStatus!: string;
    department = new Department;
    team: Employee[] = [];
}