import {
  DEFAULT_CONTEXT,
  DEFAULT_ERROR_CODE,
  DEFAULT_MODULE,
} from "../config/defaultValues";
import { errorCodeSelector } from "../error-code/errorCodeSelector";
import { severityDescriptionMap } from "../severity/severityDescriptionMap";

import { TransmutedError } from "./TransmutedError";
import { TransmutedErrorProps } from "./types";

describe("TransmutedError", () => {
  test("simple getter should work", () => {
    const error = new TransmutedError({
      message: "Test-Message",
      name: "Getter-Test",
    });

    console.log({ simpleGetter: error.simpleGetter });

    expect(error.simpleGetter).toBe("works");
  });

  test("should properly initialize with given props", () => {
    const props: TransmutedErrorProps = {
      name: "TestError",
      message: "Test message",
      severity: "critical",
      cause: "Test cause",
      errorCode: errorCodeSelector.HTTP_INTERNAL_SERVER_ERROR,
      context: "Test context",
      module: "Test module",
    };

    const error = new TransmutedError(props);

    console.log({ error, identifier: error.identifier });

    expect(error.name).toBe(props.name);
    expect(error.message).toBe(props.message);
    expect(error.severity).toBe(props.severity);
    expect(error.cause).toBe(props.cause);
    expect(error.errorCode).toBe(props.errorCode);
    expect(error.context).toBe(props.context);
    expect(error.module).toBe(props.module);
    expect(error.instanceUuid).toBeDefined();
    expect(error.identifier).toBe(
      `${props.name}/${props.module}/${props.context}/${props.errorCode}`
    );
  });

  test("should use default values for optional fields", () => {
    const props: TransmutedErrorProps = {
      name: "TestError",
      message: "Test message",
    };

    const error = new TransmutedError(props);

    expect(error.severity).toBe("unexpected"); // Default severity
    expect(error.cause).toBeUndefined();
    expect(error.errorCode).toBe(errorCodeSelector.UNKNOWN_ERROR);
    expect(error.context).toBeUndefined();
    expect(error.module).toBeUndefined();
    expect(error.identifier).toBe(
      `${props.name}/${DEFAULT_MODULE}/${DEFAULT_CONTEXT}/${DEFAULT_ERROR_CODE}`
    );
  });

  test("should handle error origin and stack trace correctly", () => {
    const originError = new Error("Origin error");
    const props: TransmutedErrorProps = {
      name: "TestError",
      message: "Test message",
      origin: originError,
    };

    const error = new TransmutedError(props);

    expect(error.origin).toBe(originError);
    expect(error.stack).toBe(originError.stack);
  });

  test("should return correct severity description", () => {
    const props: TransmutedErrorProps = {
      name: "TestError",
      message: "Test message",
      severity: "critical",
    };

    const error = new TransmutedError(props);

    expect(error.severityDescription).toBe(severityDescriptionMap.critical);
  });
});
