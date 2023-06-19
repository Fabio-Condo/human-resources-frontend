export interface IVocationFilter {
    employee?: number,
    vocationStatus?: string;
    vocationType?: string;
    beginDate?: Date;
    endDate?: Date;

    page: number,
    itemsPerPage: number,
    sort: string
}