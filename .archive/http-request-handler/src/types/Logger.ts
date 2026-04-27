/**
 * Function type for logging details.
 *
 * @param {LogDetails} details - The details of the log entry.
 */
export type Logger = (details: LogDetails) => void;

/**
 * Interface representing the details of a log entry.
 */
export interface LogDetails {
  /** Indicates if the request was successful. */
  success: boolean;

  /** The URL template used for the request. */
  urlTemplate: string;

  /** The HTTP method used for the request. */
  method: string;

  /** The duration of the request in milliseconds. */
  duration: number;

  /** The number of attempts made (optional). */
  attempts?: number;

  /** The final URL used for the request (optional). */
  url?: string;

  /** The HTTP status code of the response (optional). */
  status?: number;

  /** The request body (optional). */
  requestBody?: any;

  /** The response body (optional). */
  responseBody?: any;

  /** The headers of the request (optional). */
  headers?: Record<string, string>;
}
