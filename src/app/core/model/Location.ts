import { ILocation } from "../interfaces/ILocation";
import { Country } from "./Country";

export class Location implements ILocation{
    id!: number;
    name!: string;
    description!: string;
    country = new Country;
}