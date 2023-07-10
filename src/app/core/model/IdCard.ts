export class IdCard {
    id?: number;
    type?: string;
    idNumber?: string;
    issueDate?: string;

    constructor(id?: number, type?: string,  idNumber?: string, issueDate?: string) {
        this.id = id;
        this.type = type;
        this.idNumber = idNumber;
        this.issueDate = issueDate;
    }
}