import { ICompanyTraining } from "../interfaces/ICompanyTraining";
import { IEmployee } from "../interfaces/IEmployee";
import { Contact } from "./Contact";
import { Dependent } from "./Depedent";
import { EmployeePerformanceEvaluation } from "./EmployeePerformanceEvaluation";
import { EmployeeTraining } from "./EmployeeTraining";
import { EmployeeWage } from "./EmployeeWage";
import { IdCard } from "./IdCard";
import { Position } from "./Position";
import { Project } from "./Project";
import { Province } from "./Province";
import { Skill } from "./Skill";
import { Vocation } from "./Vocation";
import { Location } from "./Location";

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
    birthplace = new Location;
    province = new  Province;
    employeePerformanceEvaluations: EmployeePerformanceEvaluation[] = [];
    position = new Position;
    wageHistories: EmployeeWage[] = [];
    employeeTrainings: EmployeeTraining [] = [];
    contacts: Contact[] = [];
    idCards: IdCard[] = [];
    projects: Project[] = [];
    vocations: Vocation[] = [];
    skills: Skill[] = [];
    companyTrainings: ICompanyTraining[] = [];
    dependents: Dependent[] = [];
}


// npm install json-ignore --save