export interface IEmployeePerformanceEvaluationFilter {
    global?: string,
    category?: string,
    employee?: number,
    position?: number,
    department?: number,
    date?: Date,


    page: number,
    itemsPerPage: number,
    sort: string
}