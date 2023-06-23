import { IJob } from "../interfaces/IJob";
import { Employee } from "./Employee";
import { Position } from "./Position";
import { User } from "./User";

export class Job implements IJob{
    id!: number;
    publicationDate!: Date;
    expirationDate!: Date; 
    position = new Position;
    candidates: User[] = [];
}