export interface ICompanyTrainingFilter {

    companyTrainingTypeLevel?: number,
    date?: Date;

    page: number,
    itemsPerPage: number,
    sort: string
}