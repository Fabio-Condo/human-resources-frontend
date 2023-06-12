import { ICompanyTraining } from "../interfaces/ICompanyTraining";
import { CompanyTrainingType } from "./CompanyTrainingType";

export class CompanyTraining implements ICompanyTraining{
    id!: number;
    date!: Date;
    duration!: string;
    companyTrainingType = new CompanyTrainingType;
}