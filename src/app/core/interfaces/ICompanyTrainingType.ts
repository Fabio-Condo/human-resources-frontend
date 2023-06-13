import { ICompanyTrainingTypeGoal } from "./ICompanyTrainingTypeGoal";

export interface ICompanyTrainingType {
    id: number,
    type: string,
    level: string,
    companyTrainingTypeGoals: ICompanyTrainingTypeGoal[];
}