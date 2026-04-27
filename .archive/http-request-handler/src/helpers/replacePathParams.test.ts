import { replacePathParams } from "./replacePathParams";
import { baseURL } from "../tests/globalSetup";

describe("Test the replacePathParamsFunction", () => {
  test("replacement works correctly", async () => {
    const url = replacePathParams(`${baseURL}/{id}`, {
      id: "111",
      wontDo: "anything",
    });

    expect(url).toBe(`${baseURL}/111`);
  });
});
