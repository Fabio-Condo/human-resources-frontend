import { IJob } from "../interfaces/IJob";
import { Position } from "./Position";

export class Job implements IJob{
    id!: number;
    publicationDate!: Date;
    expirationDate!: Date; 
    position = new Position;
}