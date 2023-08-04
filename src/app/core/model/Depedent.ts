import { Person } from "./Person";

export class Dependent {
    id?: number;
    relationship?: string;
    person: Person;

    constructor(person: Person, id?: number, relationship?: string) {
        this.id = id;
        this.relationship = relationship;
        this.person = person;
    }
}