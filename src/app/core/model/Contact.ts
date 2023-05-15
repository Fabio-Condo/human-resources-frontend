export class Contact {
    id?: number;
    contactNumber?: string;
    name?: string;

    constructor(id?: number,contactNumber?: string,name?: string) {
        this.id = id;
        this.contactNumber = contactNumber;
        this.name = name;
    }
}