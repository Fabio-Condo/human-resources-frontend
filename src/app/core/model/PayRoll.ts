import { IPayRoll } from "../interfaces/IPayRoll";
import { Employee } from "./Employee";
import { Payment } from "./Payment";

export class PayRoll implements IPayRoll{
    id!: number;
    description!: string;
    referenceMonth!: Date;
    releaseDate!: Date;
    payments: Payment[] = [];
}