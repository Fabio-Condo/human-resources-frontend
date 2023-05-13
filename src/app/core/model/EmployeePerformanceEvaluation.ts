import { IEmployee } from "../interfaces/IEmployee";
import { IEmployeePerformanceEvaluation } from "../interfaces/IEmployeePerformanceEvaluation";
import { Employee } from "./Employee";

export class EmployeePerformanceEvaluation implements IEmployeePerformanceEvaluation {
    id!: number;
    category!: string;
    date!: Date;
    teamWork!: string;
    communication!: string;
    strategicThought!: string;
    qualityOrientation!: string;
    forEmployeeImprovement!: string;
    evaluatorsComments!: string;
    evaluatorsRecommendations!: string;
    employee = new Employee;
}