export interface IJobFilter {
    positionName?: string;
    workplace?: string;
    publicationDate?: Date;
    name?: string,
    page: number,
    itemsPerPage: number,
    sort: string
}