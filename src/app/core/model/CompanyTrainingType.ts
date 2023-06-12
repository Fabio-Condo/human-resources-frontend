import { ICompanyTrainingType } from "../interfaces/ICompanyTrainingType";

export class CompanyTrainingType implements ICompanyTrainingType{
    id!: number;
    type!: string;
    level!: string;
}