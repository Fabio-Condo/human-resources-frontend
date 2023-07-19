
export class EmployeeExperience {
    id?: number;
    description?: string;
    company?: string;
    beginDate?: Date;
    endDate?: Date;

    constructor(id?: number,description?: string,company?: string, beginDate?: Date, endDate?: Date) {
        this.id = id;
        this.description = description;
        this.company = company;
        this.beginDate = beginDate;
        this.endDate = endDate;
    }
}