import { mergeBaseUrlAndEndpointTemplate } from "./mergeBaseUrlAndEndpointTemplate";

describe("test mergeBaseUrlAndEndpointTemplate", () => {
  const baseUrl = "http://google.com";
  const baseUrlWSlash = baseUrl + "/";

  const endpointTemplate = "user/{id}/bla/";
  const endpointTemplateWSlash = "/" + endpointTemplate;

  const desiredResult = baseUrl + "/" + endpointTemplate;
  test("simple test", () => {
    expect(mergeBaseUrlAndEndpointTemplate(baseUrl, endpointTemplate)).toBe(
      desiredResult
    );
  });

  test("with slash in baseUrl", () => {
    expect(
      mergeBaseUrlAndEndpointTemplate(baseUrlWSlash, endpointTemplate)
    ).toBe(desiredResult);
  });

  test("with slash in endpointTemplate", () => {
    expect(
      mergeBaseUrlAndEndpointTemplate(baseUrl, endpointTemplateWSlash)
    ).toBe(desiredResult);
  });

  test("with slash in baseUrl and endpointTemplate", () => {
    expect(
      mergeBaseUrlAndEndpointTemplate(baseUrlWSlash, endpointTemplateWSlash)
    ).toBe(desiredResult);
  });
});
