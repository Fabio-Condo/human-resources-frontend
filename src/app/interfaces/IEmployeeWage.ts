import { IEmployee } from "./IEmployee";

export interface IEmployeeWage {
    id: number,
    value: number,
    employee: IEmployee;
}