import { IDepartment } from "./IDepartments";
import { IEmployee } from "./IEmployee";

export interface IProject {
    id: number,
    name: string,
    projectStatus: string,
    department: IDepartment,
    team: IEmployee[];
}