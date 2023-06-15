import { Employee } from "./Employee";

export class Payment {
    id?: number;
    employee = new Employee

    constructor(id?: number, employee = new Employee) {
        this.id = id;
        this.employee = employee;
    }
}