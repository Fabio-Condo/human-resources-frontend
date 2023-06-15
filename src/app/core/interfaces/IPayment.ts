import { IEmployee } from "./IEmployee";

export interface IPayment {
    id?: number;
    employee: IEmployee,
}