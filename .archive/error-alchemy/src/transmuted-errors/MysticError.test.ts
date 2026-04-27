import { MysticError } from "./MysticError";
import { TransmutedError } from "./TransmutedError";

describe("MysticError", () => {
  test("Should be a valid MysticError", () => {
    const error = new MysticError({
      message: "Test-MysticError-Message",
      name: "Test-MysticError",
    });

    expect(error).toBeInstanceOf(MysticError);
    expect(error).toBeInstanceOf(TransmutedError);
  });
});
