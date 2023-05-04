import { IDepartment } from "../interfaces/IDepartments";
import { Employee } from "./Employee";

export class Department implements IDepartment {
    id!: number;
    name!: string;
    employees: Employee[] = [];
}