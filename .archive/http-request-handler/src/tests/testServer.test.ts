import axios from "axios";
import { baseURL } from "./globalSetup";

describe("Test the Test-Server", () => {
  test("a simple axios-request", async () => {
    const result = await axios({
      baseURL,
      method: "post",
      data: { test: "works" },
    });

    expect(result.data.body.test).toBe("works");
  });
});
