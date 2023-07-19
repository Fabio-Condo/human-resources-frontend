export interface IPositionFilter {
    global?: string,
    name?: string,
    positionType?: string,
    functionalGroup?: string,
    department?: number,
    location?: number,
    employeeOrderBy?: string,

    page: number,
    itemsPerPage: number,
    sort: string
}