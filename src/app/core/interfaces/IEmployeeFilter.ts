export interface IEmployeeFilter {
    name?: string,

    gender?: string,
    contractType?: string,
    maritalStatus?: string,
    province?: number,
    position?: number,

    page: number,
    itemsPerPage: number,
    sort: string
}