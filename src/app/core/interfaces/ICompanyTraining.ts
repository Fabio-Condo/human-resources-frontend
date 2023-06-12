import { ICompanyTrainingType } from "./ICompanyTrainingType";

export interface ICompanyTraining {
    id: number,
    date: Date,
    duration: string,
    companyTrainingType: ICompanyTrainingType;
}