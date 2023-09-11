import { Profile } from "../model/Profile";
import { User } from "../model/User";
import { IEmployee } from "./IEmployee";
import { IPosition } from "./IPosition";

export interface IJob {
    id: number;
    publicationDate: Date;
    expirationDate: Date; 
    position: IPosition,
    //candidates: User[];
    candidates: Profile[];
}