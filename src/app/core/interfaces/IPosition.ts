import { IBenefit } from "./IBenefit";
import { IDepartment } from "./IDepartments";
import { IEmployee } from "./IEmployee";
import { IMainResponsibility } from "./IMainResponsibility";
import { IPositionLanguages } from "./IPositionLanguages";
import { ISpecificRequirement } from "./ISpecificRequirement";
import { IWorkplace } from "./IWorkplace";

export interface IPosition {
    id: number,
    name: string,
    functionalGroup: string,
    mission: string,
    age: number,
    maximumWage: number,
    minimumWage: number,
    department: IDepartment,
    workplace: IWorkplace,
    benefits: IBenefit[];
    mainResponsibilities: IMainResponsibility[];
    specificRequirements: ISpecificRequirement[];
    employees: IEmployee[];
}