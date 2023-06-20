import { IPosition } from "./IPosition";

export interface IJob {
    id: number;
    publicationDate: Date;
    expirationDate: Date; 
    position: IPosition,
}