import { baseURL } from "../../tests/globalSetup";
import { makeHttpRequest } from "../../requests/makeHttpRequest";
import { z } from "zod";
import { ResponseParsingError } from "./response";

describe("Provoking invalid response to throw the correct errors", () => {
  test("ResponseParsingError", async () => {
    try {
      await makeHttpRequest({
        urlTemplate: baseURL,
        method: "post",
        responseBodySchema: z.string(),
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ResponseParsingError);
    }
  });
});
