export interface BaseResponse<T> {
    status: number;
    data: T;
    message: string;
}