import { IEmployee } from "../interfaces/IEmployee";
import { Province } from "./Province";

export class Employee implements IEmployee {
    id!: number;
    name!: string;
    gender!: string;
    birthday!: Date;
    physicalAddress!: string;
    maritalStatus!: string;
    spousesName!: string;
    province = new  Province;
}