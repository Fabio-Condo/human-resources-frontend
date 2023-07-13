export interface ICompanyTrainingFilter {
    global?: string,
    companyTrainingTypeLevel?: number,
    date?: Date;

    page: number,
    itemsPerPage: number,
    sort: string
}