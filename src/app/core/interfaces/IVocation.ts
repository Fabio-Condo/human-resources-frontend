import { IEmployee } from "./IEmployee";

export interface IVocation {
    id: number;

    beginDate: Date;
    endDate: Date;
    vocationStatus: string;
    employee: IEmployee;
}