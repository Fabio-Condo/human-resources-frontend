import { ICompanyTraining } from "../interfaces/ICompanyTraining";
import { IEmployee } from "../interfaces/IEmployee";
import { IProject } from "../interfaces/IProject";
import { ISkill } from "../interfaces/ISkill";
import { IVocation } from "../interfaces/IVocation";
import { Contact } from "./Contact";
import { Dependent } from "./Depedent";
import { EmployeePerformanceEvaluation } from "./EmployeePerformanceEvaluation";
import { EmployeeTraining } from "./EmployeeTraining";
import { EmployeeWage } from "./EmployeeWage";
import { Position } from "./Position";
import { Project } from "./Project";
import { Province } from "./Province";
import { Skill } from "./Skill";
import { Vocation } from "./Vocation";

export class Employee implements IEmployee {
    id!: number;
    name!: string;
    gender!: string;
    contractType!: string;
    birthday!: Date;
    physicalAddress!: string;
    maritalStatus!: string;
    spousesName!: string;
    status!: boolean;
    wageValue!: number;
    province = new  Province;
    employeePerformanceEvaluations: EmployeePerformanceEvaluation[] = [];
    position = new Position;
    wageHistories: EmployeeWage[] = [];
    employeeTrainings: EmployeeTraining [] = [];
    contacts: Contact[] = [];
    projects: Project[] = [];
    vocations: Vocation[] = [];
    skills: Skill[] = [];
    companyTrainings: ICompanyTraining[] = [];
    dependents: Dependent[] = [];
}


// npm install json-ignore --save