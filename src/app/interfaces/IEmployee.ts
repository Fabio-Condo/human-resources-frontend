import { IDepartment } from "./IDepartments";
import { IEmployeePerformanceEvaluation } from "./IEmployeePerformanceEvaluation";
import { IProvince } from "./IProvince";

export interface IEmployee {
    id: number,
    name: string,
    gender: string,
    birthday: Date,
    physicalAddress: string,
    maritalStatus: string,
    spousesName: string,
    province: IProvince;
    department: IDepartment;
    employeePerformanceEvaluations: IEmployeePerformanceEvaluation[];
}