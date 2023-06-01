import { IWorkplace } from "../interfaces/IWorkplace";

export class Workplace implements IWorkplace{
    id!: number;
    name!: string;
    description!: string;
}