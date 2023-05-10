import { IEmployee } from "../interfaces/IEmployee";
import { IEmployeeWage } from "../interfaces/IEmployeeWage";

export class EmployeeWage implements IEmployeeWage {
    id!: number;
    value!: number;
    employee!: IEmployee;
}
