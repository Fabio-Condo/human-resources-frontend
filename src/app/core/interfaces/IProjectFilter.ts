export interface IProjectFilter {
    name?: string,
    department?: number,
    projectStatus?: string,

    page: number,
    itemsPerPage: number,
    sort: string
}