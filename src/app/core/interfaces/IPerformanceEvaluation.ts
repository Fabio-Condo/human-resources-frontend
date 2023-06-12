import { Skill } from "../model/Skill";
import { IPosition } from "./IPosition";
import { ISkill } from "./ISkill";

export interface IPerformanceEvaluation {
    id: number,  
    position: IPosition,
    skill: Skill,
    proficiencyLevel: string
}