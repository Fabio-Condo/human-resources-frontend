import { IEmployee } from "./IEmployee";

export interface IEmployeeWage {
    id: number,
    value: number,
    date: Date,
    employee: IEmployee;
}