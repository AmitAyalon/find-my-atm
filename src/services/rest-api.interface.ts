export interface IRestApiResonse<T> {
  data?: T;
  status: number;
}

export interface IRestApiError {
  message: string;
  status: number;
}

export type IPromiseResponse<T> = Promise<IRestApiResonse<T>>;