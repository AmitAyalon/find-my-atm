/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { IPromiseResponse } from "./rest-api.interface";

class RestApi {

  #apiUrl: string;

  constructor(apiUrl: string) {
    this.#apiUrl = apiUrl;
  }

  get<T>(url: string, payload?: any): IPromiseResponse<T> {
    return axios.get(this.#apiUrl + url, payload);
  }

  post<T>(url: string, data?: any): IPromiseResponse<T> {
    return axios.post(this.#apiUrl + url, data);
  }

  put<T>(url: string, data?: any): IPromiseResponse<T> {
    return axios.put(this.#apiUrl + url, data);
  }

  patch<T>(url: string, data?: any): IPromiseResponse<T> {
    return axios.patch(this.#apiUrl + url, data);
  }

  delete<T>(url: string, payload?: any): IPromiseResponse<T> {
    return axios.delete(this.#apiUrl + url, payload);
  }
}

export default RestApi;