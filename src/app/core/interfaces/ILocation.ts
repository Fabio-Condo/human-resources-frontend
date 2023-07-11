import { Country } from "../model/Country"

export interface ILocation {
    id: number,
    name: string,
    description: string
    country: Country;
}