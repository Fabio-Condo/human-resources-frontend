import { IVocation } from "../interfaces/IVocation";
import { Employee } from "./Employee";

export class Vocation implements IVocation{
    id!: number;
    beginDate!: Date;
    endDate!: Date;
    vocationStatus!: string;
    vocationType!: string;
    employee = new Employee;
}