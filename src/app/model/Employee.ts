import { IEmployee } from "../interfaces/IEmployee";
import { Department } from "./Department";
import { EmployeePerformanceEvaluation } from "./EmployeePerformanceEvaluation";
import { EmployeeWage } from "./EmployeeWage";
import { Position } from "./Position";
import { Province } from "./Province";

export class Employee implements IEmployee {
    id!: number;
    name!: string;
    gender!: string;
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

}


// npm install json-ignore --save