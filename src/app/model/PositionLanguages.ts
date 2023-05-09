import { IPositionLanguages } from "../interfaces/IPositionLanguages";

export class PositionLanguages implements IPositionLanguages{
    id?: number;
    name?: string;
    writeLevel?: string;
    readLevel?: string;

    constructor(id?: number,name?: string,writeLevel?: string, readLevel?:string) {
        this.id = id;
        this.name = name;
        this.writeLevel = writeLevel;
        this.readLevel = readLevel;
    }
}