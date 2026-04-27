export const parseStackLine = (line: string): Record<string, unknown> => {
  const trimmedLine = line.trim();

  // Handle unconventional lines (e.g., error messages)
  if (!trimmedLine.startsWith("at ") || !trimmedLine.includes(":")) {
    return {
      text: trimmedLine,
      filePath: undefined,
      line: undefined,
      location: undefined,
    };
  }

  // Define regex to capture (path:line:column) or path:line:column
  const regex = /\(([^)]+):(\d+):(\d+)\)|([^:\s]+):(\d+):(\d+)/;
  const match = regex.exec(trimmedLine);

  if (match) {
    const filePath = match[1] || match[4] || ""; // Default to an empty string if undefined
    const lineNumber = match[2] || match[5];
    const columnNumber = match[3] || match[6];

    return {
      text: trimmedLine,
      filePath: filePath.trim(),
      line: lineNumber ? parseInt(lineNumber, 10) : undefined,
      location: columnNumber ? parseInt(columnNumber, 10) : undefined,
    };
  }

  // Fallback for lines without a match
  return {
    text: trimmedLine,
    filePath: undefined,
    line: undefined,
    location: undefined,
  };
};
