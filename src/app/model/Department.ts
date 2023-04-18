import { IDepartment } from "../interfaces/IDepartments";

export class Department implements IDepartment {
    id!: number;
    name!: string;
}