import { MainResponsibility } from "../model/MainResponsibility";
import { IAdministrativeCluster } from "./IAdministrativeCluster";
import { IDepartment } from "./IDepartments";
import { IMainResponsibility } from "./IMainResponsibility";
import { ISpecificRequirement } from "./ISpecificRequirement";
import { IWorkplace } from "./IWorkplace";

export interface IPosition {
    id: number,
    name: string,
    functionalGroup: string,
    mission: string,
    age: number,
    language: string,
    department: IDepartment,
    workplace: IWorkplace,
    administrativeCluster: IAdministrativeCluster,
    mainResponsibilities: IMainResponsibility[];
    specificRequirements: ISpecificRequirement[];
}