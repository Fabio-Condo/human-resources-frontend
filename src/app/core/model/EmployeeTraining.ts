import { IEmployee } from "../interfaces/IEmployee";
import { IEmployeeTraining } from "../interfaces/IEmployeeTraining";

export class EmployeeTraining implements IEmployeeTraining {
    id?: number;
    description?: string;
    begin?: Date;
    end?: Date;

    constructor(id?: number,description?: string, begin?: Date, end?: Date,) {
        this.id = id;
        this.description = description;
        this.begin = begin;
        this.end = end;
    }

}