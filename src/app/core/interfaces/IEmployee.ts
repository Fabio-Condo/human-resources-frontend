import { CompanyTraining } from "../model/CompanyTraining";
import { Contact } from "../model/Contact";
import { Dependent } from "../model/Depedent";
import { IdCard } from "../model/IdCard";
import { Skill } from "../model/Skill";
import { IEmployeePerformanceEvaluation } from "./IEmployeePerformanceEvaluation";
import { IEmployeeTraining } from "./IEmployeeTraining";
import { IEmployeeWage } from "./IEmployeeWage";
import { ILocation } from "./ILocation";
import { IPosition } from "./IPosition";
import { IProject } from "./IProject";
import { ISkill } from "./ISkill";
import { IVocation } from "./IVocation";

export interface IEmployee {
    id: number,
    name: string,
    email: string,
    gender: string,
    contractType: string
    birthday: Date,
    hiringDate: Date,
    nationality: string,
    physicalAddress: string,
    maritalStatus: string,
    spousesName: string,
    status: boolean,
    wageValue: number,
    birthplace: ILocation;
    residenceLocation: ILocation;
    employeePerformanceEvaluations: IEmployeePerformanceEvaluation[];
    position: IPosition;
    wageHistories: IEmployeeWage[];
    employeeTrainings: IEmployeeTraining[];
    contacts: Contact[];
    idCards: IdCard[];
    projects: IProject[];
    vocations: IVocation[];
    skills: Skill[];
    companyTrainings: CompanyTraining[];
    dependents: Dependent[];
}