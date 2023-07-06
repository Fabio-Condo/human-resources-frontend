import { CompanyTraining } from "../model/CompanyTraining";
import { Contact } from "../model/Contact";
import { Dependent } from "../model/Depedent";
import { Skill } from "../model/Skill";
import { IEmployeePerformanceEvaluation } from "./IEmployeePerformanceEvaluation";
import { IEmployeeTraining } from "./IEmployeeTraining";
import { IEmployeeWage } from "./IEmployeeWage";
import { IPosition } from "./IPosition";
import { IProject } from "./IProject";
import { IProvince } from "./IProvince";
import { ISkill } from "./ISkill";
import { IVocation } from "./IVocation";

export interface IEmployee {
    id: number,
    name: string,
    gender: string,
    contractType: string
    birthday: Date,
    physicalAddress: string,
    maritalStatus: string,
    spousesName: string,
    status: boolean,
    wageValue: number,
    province: IProvince;
    employeePerformanceEvaluations: IEmployeePerformanceEvaluation[];
    position: IPosition;
    wageHistories: IEmployeeWage[];
    employeeTrainings: IEmployeeTraining[];
    contacts: Contact[];
    projects: IProject[];
    vocations: IVocation[];
    skills: Skill[];
    companyTrainings: CompanyTraining[];
    dependents: Dependent[];
}