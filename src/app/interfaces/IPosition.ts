import { IAdministrativeCluster } from "./IAdministrativeCluster";
import { IDepartment } from "./IDepartments";
import { IWorkplace } from "./IWorkplace";

export interface IPosition {
    id: number,
    name: string,
    functionalGroup: string,
    mission: string,
    training: string,
    professionalExperience: string,
    age: number,
    language: string,
    specificRequirements: string,
    mainResponsibilities: string,
    department: IDepartment,
    workplace: IWorkplace,
    administrativeCluster: IAdministrativeCluster,
}