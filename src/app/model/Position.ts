import { IMainResponsibility } from "../interfaces/IMainResponsibility";
import { IPosition } from "../interfaces/IPosition"
import { AdministrativeCluster } from "./AdministrativeCluster";
import { Benefit } from "./Benefit";
import { Department } from "./Department";
import { Employee } from "./Employee";
import { MainResponsibility } from "./MainResponsibility";
import { PositionLanguages } from "./PositionLanguages";
import { ProfessionalExperience } from "./ProfessionalExperience";
import { SpecificRequirement } from "./SpecificRequirement";
import { Training } from "./Training";
import { Workplace } from "./Workplace";

export class Position implements IPosition {
    id!: number;
    name!: string;
    functionalGroup!: string;
    mission!: string;
    age!: number;
    //hierarchicalReporter = new Employee;
    department = new Department;
    workplace = new Workplace;
    administrativeCluster = new AdministrativeCluster;
    benefits: Benefit[] = [];
    mainResponsibilities: MainResponsibility[] = [];
    specificRequirements: SpecificRequirement[] = [];
    training: Training[] = [];
    professionalExperience: ProfessionalExperience[] = [];
    employees: Employee[] = [];
    languages: PositionLanguages[] = [];
}