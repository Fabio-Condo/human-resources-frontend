import { IEmployee } from "./IEmployee";

export interface IEmployeePerformanceEvaluation {
    id: number,  
    category: string,
    date: Date,
    teamWork: string,
    communication: string,
    strategicThought: string,
    qualityOrientation: string,
    forEmployeeImprovement: string,
    evaluatorsComments: string,
    evaluatorsRecommendations: string,
    employee: IEmployee,
}