export interface IEmployeePerformanceEvaluationFilter {
    global?: string,
    category?: string,
    employee?: number,

    page: number,
    itemsPerPage: number,
    sort: string
}