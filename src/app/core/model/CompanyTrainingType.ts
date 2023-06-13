import { ICompanyTrainingType } from "../interfaces/ICompanyTrainingType";
import { CompanyTrainingTypeGoal } from "./CompanyTrainingTypeGoal";

export class CompanyTrainingType implements ICompanyTrainingType{
    id!: number;
    type!: string;
    level!: string;
    companyTrainingTypeGoals: CompanyTrainingTypeGoal[] = [];
}