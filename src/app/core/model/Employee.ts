import { IEmployee } from "../interfaces/IEmployee";
import { Contact } from "./Contact";
import { EmployeePerformanceEvaluation } from "./EmployeePerformanceEvaluation";
import { EmployeeTraining } from "./EmployeeTraining";
import { EmployeeWage } from "./EmployeeWage";
import { Position } from "./Position";
import { Province } from "./Province";

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
}


// npm install json-ignore --save