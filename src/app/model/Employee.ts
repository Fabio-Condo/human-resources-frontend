import { IEmployee } from "../interfaces/IEmployee";
import { Department } from "./Department";
import { EmployeePerformanceEvaluation } from "./EmployeePerformanceEvaluation";
import { Province } from "./Province";

export class Employee implements IEmployee {
    id!: number;
    name!: string;
    gender!: string;
    birthday!: Date;
    physicalAddress!: string;
    maritalStatus!: string;
    spousesName!: string;
    province = new  Province;
    department = new Department;
    employeePerformanceEvaluations: EmployeePerformanceEvaluation[] = [];
}