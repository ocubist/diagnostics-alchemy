export const compilerEnvKeyWords = [
  "node:internal", // Node.js internal modules
  "Module._compile", // Node.js module compilation process
  "at <anonymous>", // Anonymous functions, common in various environments
  "react-dom/", // React DOM, specific to React environment
  "zone.js", // Angular environment, often used with Zone.js for error handling
  "vue.runtime.esm.js", // Vue.js runtime, specific to Vue environment
  "webpack/", // Webpack module bundler, often used in modern web development
  "babel.js", // Babel JavaScript compiler, common in projects using ES6+
  "react-native/", // React Native environment for mobile app development
  "Electron", // Electron framework for desktop application development
  "mocha/", // Mocha test framework, used for unit/integration testing
  "jest", // Jest test framework, popular in React and other JS environments
  "http://", // Common in browser environments for scripts loaded over HTTP
  "https://", // Common in browser environments for scripts loaded over HTTPS
  "aws-sdk", // AWS SDK, common in serverless environments like AWS Lambda
  "internal/modules/", // General Node.js internal modules
  "processTicksAndRejections", // Node.js process tick/rejection
  "legacy-code-todo-rewrite", // Legacy Jest-related stack traces
  "jestAdapter", // Jest adapter stack traces
  "internal/process/task_queues", // Node.js internal async task queues
];
