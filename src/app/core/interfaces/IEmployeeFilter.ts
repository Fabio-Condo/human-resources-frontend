export interface IEmployeeFilter {
    global?: string,
    name?: string,
    gender?: string,
    positionType?: string,
    maritalStatus?: string,
    birthplace?: number,
    position?: number,
    department?: number,

    page: number,
    itemsPerPage: number,
    sort: string
}