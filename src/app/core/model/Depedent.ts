export class Dependent {
    id?: number;
    name?: string;
    gender?: string;
    relationship?: string;
    birthday?: Date;

    constructor(id?: number, name?: string, gender?: string, relationship?: string, birthday?: Date) {
        this.id = id;
        this.name = name;
        this.gender = gender;
        this.relationship = relationship;
        this.birthday = birthday;
    }
}