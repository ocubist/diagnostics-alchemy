import { Severity } from "./types";

export type SeverityDescriptionMap = {
  [K in Severity]: string;
};

export const severityDescriptionMap: SeverityDescriptionMap = {
  unimportant: "Can safely be ignored.",
  minor: "Does not need immediate attention, like smaller visual bugs.",
  unexpected: "Was not expected and can potentially be very harmful.",
  critical: "Might break functionality, but shouldn't be fatal.",
  fatal:
    "Will potentially causes a complete system-failure and needs immediate attention.",
  catastrophic:
    "Potentially really harmful error, that might cause real damage if not dealt with immediately",
};
