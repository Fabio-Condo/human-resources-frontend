import { IProject } from "../interfaces/IProject";
import { Department } from "./Department";
import { Employee } from "./Employee";
import { ProjectTask } from "./ProjectTask";

export class Project implements IProject{
    id!: number;
    name!: string;
    description!: string;
    projectStatus!: string;
    department = new Department;
    tasks: ProjectTask[] = [];
    team: Employee[] = [];
}