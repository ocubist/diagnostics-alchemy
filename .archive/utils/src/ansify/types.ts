export type AnsifyColor =
  | "black"
  | "blackBright"
  | "blue"
  | "blueBright"
  | "cyan"
  | "cyanBright"
  | "gray"
  | "green"
  | "greenBright"
  | "magenta"
  | "magentaBright"
  | "red"
  | "redBright"
  | "white"
  | "whiteBright"
  | "yellow"
  | "yellowBright";

export type AnsifyBackgroundColor =
  | "bgBlack"
  | "bgBlackBright"
  | "bgBlue"
  | "bgBlueBright"
  | "bgCyan"
  | "bgCyanBright"
  | "bgGreen"
  | "bgGreenBright"
  | "bgMagenta"
  | "bgMagentaBright"
  | "bgRed"
  | "bgRedBright"
  | "bgWhite"
  | "bgWhiteBright"
  | "bgYellow"
  | "bgYellowBright";

export type AnsifyStyleModifier =
  | "bold"
  | "dim"
  | "hidden"
  | "inverse"
  | "italic"
  | "reset"
  | "strikethrough"
  | "underline";

export type AnsifyModifier =
  | AnsifyColor
  | AnsifyBackgroundColor
  | AnsifyStyleModifier;
