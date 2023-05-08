import { IEmployee } from "../interfaces/IEmployee";
import { Department } from "./Department";
import { EmployeePerformanceEvaluation } from "./EmployeePerformanceEvaluation";
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
    province = new  Province;
    employeePerformanceEvaluations: EmployeePerformanceEvaluation[] = [];
    position = new Position;

}


// npm install json-ignore --save