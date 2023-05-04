import { MainResponsibility } from "../model/MainResponsibility";
import { IAdministrativeCluster } from "./IAdministrativeCluster";
import { IBenefit } from "./IBenefit";
import { IDepartment } from "./IDepartments";
import { IEmployee } from "./IEmployee";
import { IMainResponsibility } from "./IMainResponsibility";
import { IProfessionalExperience } from "./IProfessionalExperience";
import { ISpecificRequirement } from "./ISpecificRequirement";
import { IWorkplace } from "./IWorkplace";

export interface IPosition {
    id: number,
    name: string,
    functionalGroup: string,
    mission: string,
    age: number,
    language: string,
    hierarchicalReporter: IEmployee,
    department: IDepartment,
    workplace: IWorkplace,
    administrativeCluster: IAdministrativeCluster,
    benefits: IBenefit[];
    mainResponsibilities: IMainResponsibility[];
    specificRequirements: ISpecificRequirement[];
    training: ISpecificRequirement[];
    professionalExperience: IProfessionalExperience[];
}