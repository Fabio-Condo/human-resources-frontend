import { Province } from "./Province";

export class ProfessionalExperience{
    id?: number;
    description?: string;
    company?: string;
    beginDate?: Date;
    endDate?: Date;
    province = new Province;

    constructor(id?: number,description?: string,company?: string, beginDate?: Date, endDate?: Date, province = new Province) {
        this.id = id;
        this.description = description;
        this.company = company;
        this.beginDate = beginDate;
        this.endDate = endDate;
        this.province = province;
    }
}