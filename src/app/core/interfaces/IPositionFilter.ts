export interface IPositionFilter {
    name?: string,
    functionalGroup?: string,
    department?: number,
    workplace?: number,
    employeeOrderBy?: string,

    page: number,
    itemsPerPage: number,
    sort: string
}