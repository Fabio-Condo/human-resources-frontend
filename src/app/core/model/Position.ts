
import { IPosition } from "../interfaces/IPosition"
import { Benefit } from "./Benefit";
import { Department } from "./Department";
import { Employee } from "./Employee";
import { MainResponsibility } from "./MainResponsibility";
import { PositionLanguages } from "./PositionLanguages";
import { SpecificRequirement } from "./SpecificRequirement";
import { Location } from "./Location";

export class Position implements IPosition {
    id!: number;
    name!: string;
    functionalGroup!: string;
    mission!: string;
    age!: number;
    minimumWage!: number;
    maximumWage!: number;
    positionType!: string;
    department = new Department;
    location = new Location;
    benefits: Benefit[] = [];
    mainResponsibilities: MainResponsibility[] = [];
    specificRequirements: SpecificRequirement[] = [];
    employees: Employee[] = [];
}