import { ICompanyTrainingType } from "./ICompanyTrainingType";
import { IEmployee } from "./IEmployee";

export interface ICompanyTraining {
    id: number,
    date: Date,
    duration: string,
    companyTrainingType: ICompanyTrainingType;
    employees: IEmployee[];
}