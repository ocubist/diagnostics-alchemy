// @index('./**/!(*.test|*.play).ts', f => `export * from "${f.path}";`, { ignore: ["./tests/**/*", "./play/**/*"] })
export * from "./useEventHandler/useEventHandler";
// @endindex
