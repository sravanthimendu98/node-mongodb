import { AxiosPromise } from "axios";
import axiosInstance from "../interceptors";

export function AxiosApiService() {
  /**
   * Performs a GET request to the specified URL using Axios.
   *
   * @param {string} url - The URL to send the GET request to.
   * @returns {AxiosPromise<any>} A promise that resolves with the response data from the GET request.
   */
  function get(url: string): AxiosPromise<any> {
    return axiosInstance.get(url);
  }

  /**
   * Performs a POST request to the specified URL using Axios.
   *
   * @param {string} url - The URL to send the POST request to.
   * @param {any} body - The request body to send with the POST request.
   * @returns {AxiosPromise<any>} A promise that resolves with the response data from the POST request.
   */
  function post(url: string, body: any): AxiosPromise<any> {
    return axiosInstance.post(url, body);
  }

  /**
   * Performs a PUT request to the specified URL using Axios.
   *
   * @param {string} url - The URL to send the PUT request to.
   * @param {any} body - The request body to send with the PUT request.
   * @returns {AxiosPromise<any>} A promise that resolves with the response data from the PUT request.
   */
  function put(url: string, body: any): AxiosPromise<any> {
    return axiosInstance.put(url, body);
  }

  /**
   * Performs a DELETE request to the specified URL using Axios.
   *
   * @param {string} url - The URL to send the DELETE request to.
   * @returns {AxiosPromise<any>} A promise that resolves with the response data from the DELETE request.
   */
  function deleteRequest(url: string): AxiosPromise<any> {
    return axiosInstance.delete(url);
  }

  return { get, post, put, delete: deleteRequest }; // Add the delete method here
}
