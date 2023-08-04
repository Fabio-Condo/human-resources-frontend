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
import { Skill } from "./Skill";
import { Vocation } from "./Vocation";
import { Location } from "./Location";
import { EmployeeExperience } from "./EmployeeExperience";
import { Person } from "./Person";

export class Employee implements IEmployee {
    id!: number;
    name!: string;
    email!: string;
    gender!: string;
    contractType!: string;
    hiringDate!: Date;
    physicalAddress!: string;
    nationality!: string;
    maritalStatus!: string;
    spousesName!: string;
    status!: boolean;
    wageValue!: number;
    person = new Person;
    birthplace = new Location;
    residenceLocation = new Location;
    position = new Position;
    employeePerformanceEvaluations: EmployeePerformanceEvaluation[] = [];
    employeeExperiences: EmployeeExperience[] = [];
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