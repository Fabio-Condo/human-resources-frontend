export class UserTraining{
    id?: number;
    description?: string;
    begin?: Date;
    end?: Date;

    constructor(id?: number,description?: string, begin?: Date, end?: Date,) {
        this.id = id;
        this.description = description;
        this.begin = begin;
        this.end = end;
    }

}