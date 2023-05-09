import { IDepartment } from "./IDepartments";
import { IEmployeePerformanceEvaluation } from "./IEmployeePerformanceEvaluation";
import { IPosition } from "./IPosition";
import { IProvince } from "./IProvince";

export interface IEmployee {
    id: number,
    name: string,
    gender: string,
    birthday: Date,
    physicalAddress: string,
    maritalStatus: string,
    spousesName: string,
    status: boolean,
    wage: number,
    province: IProvince;
    employeePerformanceEvaluations: IEmployeePerformanceEvaluation[];
    position: IPosition;
}