
import { IPosition } from "../interfaces/IPosition"
import { Benefit } from "./Benefit";
import { Department } from "./Department";
import { Employee } from "./Employee";
import { MainResponsibility } from "./MainResponsibility";
import { PositionLanguages } from "./PositionLanguages";
import { SpecificRequirement } from "./SpecificRequirement";
import { Workplace } from "./Workplace";

export class Position implements IPosition {
    id!: number;
    name!: string;
    functionalGroup!: string;
    mission!: string;
    age!: number;
    minimumWage!: number;
    maximumWage!: number;
    department = new Department;
    workplace = new Workplace;
    benefits: Benefit[] = [];
    mainResponsibilities: MainResponsibility[] = [];
    specificRequirements: SpecificRequirement[] = [];
    employees: Employee[] = [];
}