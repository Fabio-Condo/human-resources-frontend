import { ProjectTask } from "../model/ProjectTask";
import { IDepartment } from "./IDepartments";
import { IEmployee } from "./IEmployee";

export interface IProject {
    id: number,
    name: string,
    description: string,
    projectStatus: string,
    department: IDepartment,
    tasks: ProjectTask[];
    team: IEmployee[];
}