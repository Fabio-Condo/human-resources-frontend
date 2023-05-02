import { IEmployee } from "../interfaces/IEmployee";

export class Employee implements IEmployee {
    id!: number;
    name!: string;
    gender!: string;
}