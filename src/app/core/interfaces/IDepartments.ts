import { ISerializedEmployeeExcludePositition } from "./ISerializedEmployeeExcludePositition";

export interface IDepartment {
    id: number,
    name: string,
    //responsibleEmployee: any // responsibleEmployee: IEmployee, mas estava a de "RangeError: Maximum call stack size exceeded" por chamar Employee repetidamente 
    responsibleEmployee: ISerializedEmployeeExcludePositition // responsibleEmployee: IEmployee, mas estava a de "RangeError: Maximum call stack size exceeded" por chamar Employee repetidamente 
}

// Nota: Lembrar que no backend foi excluida a propriedade position na propriedade responsibleEmployee para evitar o mesmo problema