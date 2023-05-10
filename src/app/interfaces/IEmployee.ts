import { IDepartment } from "./IDepartments";
import { IEmployeePerformanceEvaluation } from "./IEmployeePerformanceEvaluation";
import { IEmployeeWage } from "./IEmployeeWage";
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
    wageValue: number,
    province: IProvince;
    employeePerformanceEvaluations: IEmployeePerformanceEvaluation[];
    position: IPosition;
    wageHistories: IEmployeeWage[];
}