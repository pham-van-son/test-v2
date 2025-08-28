export interface IApiResponse<T> {
    statusCode: number;
    message: string;
    data: T;
}

export interface IPaginationResponse<T> {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPage: number;
    items: T[];
}