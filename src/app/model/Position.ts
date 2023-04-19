import { IPosition } from "../interfaces/IPosition"
import { AdministrativeCluster } from "./AdministrativeCluster";
import { Department } from "./Department";
import { Workplace } from "./Workplace";

export class Position implements IPosition {
    id!: number;
    name!: string;
    functionalGroup!: string;
    mission!: string;
    training!: string;
    professionalExperience!: string;
    age!: number;
    language!: string;
    specificRequirements!: string;
    mainResponsibilities!: string;
    department = new Department;
    workplace = new Workplace;
    administrativeCluster = new AdministrativeCluster;
}