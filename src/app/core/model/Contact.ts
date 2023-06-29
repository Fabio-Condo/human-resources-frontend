export class Contact {
    id?: number;
    contactNumber?: string;

    constructor(id?: number,contactNumber?: string) {
        this.id = id;
        this.contactNumber = contactNumber;
    }
}