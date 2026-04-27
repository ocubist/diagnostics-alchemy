export interface StackLine {
  text: string; // The original line of the stack trace
  line?: number; // The line number in the file (if available)
  location?: number; // The column number in the file (if available)
  filePath?: string; // The file path (if available)
}
