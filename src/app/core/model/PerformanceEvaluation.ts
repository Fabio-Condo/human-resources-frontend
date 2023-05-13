import { Skill } from "./Skill";
import { Position } from "./Position";
import { IPerformanceEvaluation } from "../interfaces/IPerformanceEvaluation";

export class PerformanceEvaluation implements IPerformanceEvaluation{
    id!: number;  
    position = new Position;
    skill = new Skill;
    proficiencyLevel!: string;
}