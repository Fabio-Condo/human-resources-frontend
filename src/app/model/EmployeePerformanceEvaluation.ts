import { IEmployee } from "../interfaces/IEmployee";
import { IEmployeePerformanceEvaluation } from "../interfaces/IEmployeePerformanceEvaluation";

export class EmployeePerformanceEvaluation implements IEmployeePerformanceEvaluation {
    id!: number;
    category!: string;
    employee!: IEmployee;
    date!: Date;
    teamWork!: string;
    communication!: string;
    strategicThought!: string;
    qualityOrientation!: string;
    forEmployeeImprovement!: string;
    evaluatorsComments!: string;
    evaluatorsRecommendations!: string;
}