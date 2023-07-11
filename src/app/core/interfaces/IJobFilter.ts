export interface IJobFilter {
    positionName?: string;
    location?: string;
    publicationDate?: Date;
    name?: string,
    page: number,
    itemsPerPage: number,
    sort: string
}