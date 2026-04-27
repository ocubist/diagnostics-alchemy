# Error Alchemy

## Description

Error Alchemy is a sophisticated error-handling framework designed for robust error management in TypeScript applications. It provides a flexible and powerful toolkit for creating custom errors, handling error transmutation, and ensuring detailed error logging and resolution. The library leverages `Zod` schemas extensively to ensure advanced type-safety and comprehensive type inference.

## Installation

To install Error Alchemy, use npm or yarn:

```bash
npm install @ocubist/error-alchemy
# or
yarn add @ocubist/error-alchemy
```

## Usage

### Basic Example

```ts
import { useErrorAlchemy } from "@ocubist/error-alchemy";
import { z } from "zod";

// Define your Zod schemas
const errorPropsSchema = z.object({
  name: z.string(),
  message: z.string(),
});

// Initialize the Error Alchemy toolkit
const { craftMysticError, craftErrorTransmuter } = useErrorAlchemy(
  "MyModule",
  "ExampleContext"
);

// Craft a custom error
const MyCustomError = craftMysticError({
  name: "MyCustomError",
  errorCode: "CUSTOM_ERROR",
  severity: "critical",
});

// Create a transmuter for the custom error
const transmuter = craftErrorTransmuter(
  (err) => err instanceof Error,
  (err) => new MyCustomError({ message: err.message, origin: err })
);

// Use the transmuter in your application
try {
  throw new Error("Something went wrong!");
} catch (error) {
  const customError = transmuter.execute(error);
  console.error("Handled error:", customError);
}
```

### Advanced Example with Error Synthesizer

```ts
import { useErrorAlchemy } from "@ocubist/error-alchemy";
import { z } from "zod";

// Define your Zod schemas
const errorPropsSchema = z.object({
  name: z.string(),
  message: z.string(),
});

// Initialize the Error Alchemy toolkit
const { craftErrorSynthesizer, craftMysticError, craftErrorTransmuter } =
  useErrorAlchemy("MyModule", "ExampleContext");

// Craft a custom error
const MyCustomError = craftMysticError({
  name: "MyCustomError",
  errorCode: "CUSTOM_ERROR",
  severity: "critical",
});

// Create a transmuter for the custom error
const transmuter = craftErrorTransmuter(
  (err) => err instanceof Error,
  (err) => new MyCustomError({ message: err.message, origin: err })
);

// Create an error synthesizer
const synthesizer = craftErrorSynthesizer([transmuter]);

// Use the synthesizer in your application
try {
  throw new Error("Something went wrong!");
} catch (error) {
  const synthesizedError = synthesizer.synthesize(error);
  console.error("Handled synthesized error:", synthesizedError);
}
```

## API Documentation

For the full API documentation, please visit the [Error Alchemy Documentation](https://ocubist.github.io/error-alchemy/).

## License

Error Alchemy is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for more information.
