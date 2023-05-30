import { Department } from "../model/Department";

export interface IProject {
    id?: number;
    name?: string;
    department: Department;
}