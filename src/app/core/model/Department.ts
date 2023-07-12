import { IDepartment } from "../interfaces/IDepartments";

export class Department implements IDepartment {
    id!: number;
    name!: string;
    description!: string;
    //responsibleEmployee: any;  // responsibleEmployee = new Employee, mas estava a de "RangeError: Maximum call stack size exceeded" por chamar Employee repetidamente 
    //responsibleEmployee = new SerializedEmployeeExcludePositition; // responsibleEmployee = new Employee, mas estava a de "RangeError: Maximum call stack size exceeded" por chamar Employee repetidamente 
    //projects: Project[] = [];
}

// Nota: Lembrar que no backend foi excluida a propriedade position na propriedade responsibleEmployee para evitar o mesmo problema