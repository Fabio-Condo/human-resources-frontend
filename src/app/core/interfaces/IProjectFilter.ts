export interface IProjectFilter {
    global?: string,
    name?: string,
    department?: number,
    projectStatus?: string,

    page: number,
    itemsPerPage: number,
    sort: string
}