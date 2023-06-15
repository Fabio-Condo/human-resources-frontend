import { IPayment } from "./IPayment";

export interface IPayRoll {
    id: number;
    description: string;
    referenceMonth: Date;
    releaseDate: Date;
    payments: IPayment[];
}