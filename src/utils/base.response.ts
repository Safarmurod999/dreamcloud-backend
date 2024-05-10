export interface BaseResponse<T> {
    status: number;
    data: T;
    message: string;
}
export interface BaseResponseGet<T> {
    status: number;
    data: T;
    message: string;
    pagination:{
        page: number,
        limit: number,
        totalCount: number,
        totalPages: number,
    }
}