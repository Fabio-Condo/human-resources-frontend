export interface IEmployeePerformanceEvaluationFilter {
    name?: string,

    category?: string,
    employee?: number,

    page: number,
    itemsPerPage: number,
    sort: string
}