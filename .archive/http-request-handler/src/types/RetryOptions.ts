import { z } from "zod";

/**
 * Optional retry options schema.
 * Defines the optional retry options for HTTP requests.
 */
export const OptionalRetryOptions = z.object({
  /**
   * The number of retry attempts.
   * Optional and must be between 0 and 5.
   */
  retries: z.number().min(0).max(5).optional(), // Maximum of 5 retries

  /**
   * The initial delay before the first retry attempt in milliseconds.
   * Optional and must be between 100 and 5000 ms.
   */
  initialDelay: z.number().min(100).max(5000).optional(), // Initial delay between 100 ms and 5,000 ms

  /**
   * The multiplier to apply to the delay between subsequent retries.
   * Optional and must be between 1 and 2.
   */
  backoffMultiplier: z.number().min(1).max(2).optional(), // Backoff multiplier between 1 and 2
});

/**
 * Optional retry options type.
 * Infers the type for the optional retry options schema.
 */
export type OptionalRetryOptions = z.infer<typeof OptionalRetryOptions>;

/**
 * Retry options schema.
 * Defines the required retry options for HTTP requests.
 */
export const RetryOptions = z.object({
  /**
   * The number of retry attempts.
   * Must be between 0 and 5.
   */
  retries: z.number().min(0).max(5), // Maximum of 5 retries

  /**
   * The initial delay before the first retry attempt in milliseconds.
   * Must be between 100 and 5000 ms.
   */
  initialDelay: z.number().min(100).max(5000), // Initial delay between 100 ms and 5,000 ms

  /**
   * The multiplier to apply to the delay between subsequent retries.
   * Must be between 1 and 2.
   */
  backoffMultiplier: z.number().min(1).max(2), // Backoff multiplier between 1 and 2
});

/**
 * Retry options type.
 * Infers the type for the retry options schema.
 */
export type RetryOptions = z.infer<typeof RetryOptions>;

/**
 * Default retry options.
 * Provides default values for the retry options.
 */
export const defaultRetryOptions: Required<z.infer<typeof RetryOptions>> = {
  retries: 3, // Default retries set to 3

  initialDelay: 1000, // Default initial delay set to 1,000 ms (1 second)

  backoffMultiplier: 2, // Default backoff multiplier set to 2
};
