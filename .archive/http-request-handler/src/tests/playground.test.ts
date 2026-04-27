import { z } from "zod";

describe("just some playground-tests", () => {
  const schema = z.undefined();

  const a = undefined;
  const b = "not undefined";

  test("undefined-schema", () => {
    expect(schema.safeParse(a).success).toBe(true);
    expect(schema.safeParse(b).success).toBe(false);
  });

  test("object with undefined-schema", () => {
    const objSchema = z.object({ val: schema });
    expect(objSchema.safeParse({}).success).toBe(true);
    expect(objSchema.safeParse({ val: a }).success).toBe(true);
    expect(objSchema.safeParse({ val: b }).success).toBe(false);
  });
});
