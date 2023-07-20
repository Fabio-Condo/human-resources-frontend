export interface IEmployeeFilter {
    global?: string,
    name?: string,
    gender?: string,
    positionType?: string,
    maritalStatus?: string,
    birthplace?: number,
    position?: number,
    department?: number,
    wageValueBegin?: number,
    wageValueEnd?: number,

    page: number,
    itemsPerPage: number,
    sort: string
}