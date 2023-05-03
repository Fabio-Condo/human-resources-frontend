import { IEmployee } from "../interfaces/IEmployee";

export class Employee implements IEmployee {
    id!: number;
    name!: string;
    gender!: string;
    birthday!: Date;
    physicalAddress!: string;
    maritalStatus!: string;
    spousesName!: string;
}