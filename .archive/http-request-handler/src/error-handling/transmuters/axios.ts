import { DetectorFunction, TransmuterFunction } from "@ocubist/error-alchemy";
import axios, { AxiosError } from "axios";
import {
  TimeoutError,
  HttpResponseError,
  NetworkError,
  UnexpectedAxiosError,
} from "../errors/axios";
import { useApiHandlerErrorAlchemy } from "../useApiHandlerErrorAlchemy";

const axiosErrorsAlchemy = useApiHandlerErrorAlchemy("AxiosErrors");

/**
 * Detector function to determine if an error is an Axios error.
 *
 * @param {any} err - The error to be checked.
 * @returns {boolean} - True if the error is an Axios error, false otherwise.
 */
const axiosDetector: DetectorFunction = (err) => axios.isAxiosError(err);

/**
 * Transmuter function to transform Axios errors into custom error types.
 *
 * @param {AxiosError} err - The Axios error to be transformed.
 * @returns {Error} - The transformed error.
 */
const axiosTransmuter: TransmuterFunction<AxiosError> = (err) => {
  // Check for timeout errors
  if (err.code) {
    // ReadTimeoutError: Read timed out
    if (err.code === "ECONNABORTED") {
      return new TimeoutError({
        message: "Request took too long to complete",
        origin: err,
        payload: {
          config: err.config, // Axios request configuration
          code: err.code, // Error code, 'ECONNABORTED'
          message: err.message, // Error message from Axios
          url: err.config?.url, // Request URL
          method: err.config?.method, // Request method
        },
      });
    }
  }

  // Check if the error has a response and a status code
  if (err.response) {
    const status = err.response.status;
    const statusText = err.response.statusText;
    const responseData = err.response.data;
    let errorMessage = `HTTP response error with status code ${status}`;

    // Customize the error message based on the status code
    switch (status) {
      case 400:
        errorMessage = "Bad request";
        break;
      case 401:
        errorMessage = "Unauthorized access";
        break;
      case 402:
        errorMessage = "Payment required";
        break;
      case 403:
        errorMessage = "Forbidden access";
        break;
      case 404:
        errorMessage = "Resource not found";
        break;
      case 405:
        errorMessage = "Method not allowed";
        break;
      case 409:
        errorMessage = "Conflict with the current state of the resource";
        break;
      case 429:
        errorMessage = "Too many requests";
        break;
      default:
        // Keep the generic message for other status codes
        errorMessage = `HTTP response error with status code ${status}`;
        break;
    }

    // HttpResponseError: Catch-all for HTTP response errors with specific messages
    return new HttpResponseError({
      message: errorMessage,
      origin: err,
      payload: { status, statusText, responseData },
    });
  }

  // Check if the error is due to a network issue
  if (!err.response) {
    // NetworkError: No response received
    return new NetworkError({
      message: "Network connectivity issue",
      origin: err,
      payload: {
        config: err.config, // Axios request configuration
        code: err.code, // Error code, e.g., 'ECONNABORTED'
        message: err.message, // Error message from Axios
        url: err.config?.url, // Request URL
        method: err.config?.method, // Request method
      },
    });
  }

  return new UnexpectedAxiosError({
    message: "An Axios-Error occurred that has not been identified.",
    origin: err,
  });
};

/**
 * Error transmuter for Axios errors.
 */
export const axiosErrorTransmuter = axiosErrorsAlchemy.craftErrorTransmuter(
  axiosDetector,
  axiosTransmuter
);
