import { IPosition } from "./IPosition";
import { ISkill } from "./ISkill";

export interface IPerformanceEvaluation {
    id: number,  
    position: IPosition,
    skill: ISkill,
    proficiencyLevel: string
}