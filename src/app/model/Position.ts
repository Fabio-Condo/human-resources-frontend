import { IMainResponsibility } from "../interfaces/IMainResponsibility";
import { IPosition } from "../interfaces/IPosition"
import { AdministrativeCluster } from "./AdministrativeCluster";
import { Department } from "./Department";
import { MainResponsibility } from "./MainResponsibility";
import { SpecificRequirement } from "./SpecificRequirement";
import { Training } from "./Training";
import { Workplace } from "./Workplace";

export class Position implements IPosition {
    id!: number;
    name!: string;
    functionalGroup!: string;
    mission!: string;
    age!: number;
    language!: string;
    department = new Department;
    workplace = new Workplace;
    administrativeCluster = new AdministrativeCluster;
    mainResponsibilities: MainResponsibility[] = [];
    specificRequirements: SpecificRequirement[] = [];
    training: Training[] = [];
}