import { Formatters, Payload, PinoLogObject } from "../../types";
import { extractLevelType } from "../extractLevelType";

export const formatLogObj = (
  logObj: PinoLogObject,
  formatters: Formatters
): string => {
  const type = extractLevelType(logObj);
  const { time, msg, specializations, err, payload, trace } = logObj;

  const hasSpecializations =
    specializations !== undefined && Object.keys(specializations).length > 0;
  const hasError = err !== undefined && Object.keys(err).length > 0;
  const hasPayload = payload !== undefined && Object.keys(payload).length > 0;
  const hasTrace = trace !== undefined && trace.length > 0;
  const hasMsg = msg !== undefined && msg.length > 0;

  let output = "";

  // # Main-Line
  // output += formatters.primary(type + " " + formatTime(time));
  output += formatters.type(type) + " " + formatters.time(time);

  if (hasSpecializations) {
    output += formatters.specializationName(
      " (" + specializations.map((s) => s.name).join(" > ") + ")"
    );
  }

  if (hasMsg) {
    output += formatters.msg(": " + msg);
  }

  // // # Trace
  // if (hasTrace) {
  //   output += "\n" + formatters.trace(trace);
  // }

  // # SpecializationPayload
  if (hasSpecializations) {
    const pls = specializations
      .filter(
        (sp) => sp.payload !== undefined && Object.keys(sp.payload).length > 0
      )
      .map((sp) => sp.payload) as Payload[];

    if (pls.length > 0) {
      output += "\n\n" + formatters.specializationPayload(pls);
    }
  }

  // # Error
  if (hasError) {
    output += "\n\n" + formatters.error(err);
  }

  // # Payload
  if (hasPayload) {
    output += "\n\n" + formatters.payload(payload);
  }

  // # Add-Side-Line
  const lines = output.split("\n");
  if (lines.length > 1) {
    const [titleLine, ...rest] = lines;
    output = [
      titleLine,
      ...rest.map((l) => formatters.primary(`│ `) + "  " + l),
    ].join("\n");
  }

  // # Add Spacing

  output = "\n" + output + "\n\n";

  return output;
};
