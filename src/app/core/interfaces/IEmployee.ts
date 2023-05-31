import { Contact } from "../model/Contact";
import { IDepartment } from "./IDepartments";
import { IEmployeePerformanceEvaluation } from "./IEmployeePerformanceEvaluation";
import { IEmployeeTraining } from "./IEmployeeTraining";
import { IEmployeeWage } from "./IEmployeeWage";
import { IPosition } from "./IPosition";
import { IProvince } from "./IProvince";

export interface IEmployee {
    id: number,
    name: string,
    gender: string,
    contractType: string
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
    employeeTrainings: IEmployeeTraining[];
    contacts: Contact[];
}