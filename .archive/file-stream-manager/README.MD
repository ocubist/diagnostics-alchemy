# File Stream Manager

## Description

The File Stream Manager provides a comprehensive set of utilities for managing file streams in Node.js environments. It allows for opening, reading, writing, flushing, and closing file streams, along with managing subscriptions and tracking usage counts. This package is particularly useful for applications requiring robust file management, such as logging systems, data processing pipelines, or any scenario where efficient and controlled file I/O operations are crucial.

### Key Functions:

- `useFileStreamManager`: A wrapper function that provides a unified interface for managing file streams.
  - `open`: Opens the file stream.
  - `close`: Closes the file stream.
  - `write`: Writes data to the file stream.
  - `read`: Reads data from the file stream.
  - `flush`: Flushes the file stream.
  - `subscribe`: Subscribes to the file stream.
  - `unsubscribe`: Unsubscribes from the file stream.
  - `getUsageCount`: Retrieves the usage count for the file stream.
  - `isFileStreamOpen`: Checks if the file stream is currently open.
- `getOpenFileStreams`: Retrieves a list of all currently open file streams by their file paths.
- `forceCloseOfAllFileStreams`: Forces the closure of all active file streams, typically used for cleanup or shutdown processes.

## Installation

To install the File Stream Manager, use npm or yarn:

```bash
npm install @ocubist/file-stream-manager
# or
yarn add @ocubist/file-stream-manager
```

## Usage

### Basic Example

Here's a basic example demonstrating how to use the `useFileStreamManager` to open, write, and close a file stream:

```typescript
import { useFileStreamManager } from "@ocubist/file-stream-manager";

const filePath = "./example.txt";
const fileManager = useFileStreamManager(filePath);

(async () => {
  await fileManager.open();
  fileManager.write("Hello, world!");
  fileManager.flush();
  const content = await fileManager.read();
  console.log(content); // Should output: Hello, world!
  await fileManager.close();
})();
```

### Advanced Example with POST Request

Here’s an advanced example showing how you might use the `useFileStreamManager` in combination with a POST request handler to log data into a file:

```typescript
import { useFileStreamManager } from "@ocubist/file-stream-manager";
import express from "express";

const app = express();
const filePath = "./log.txt";
const fileManager = useFileStreamManager(filePath);

app.use(express.json());

app.post("/log", async (req, res) => {
  try {
    await fileManager.open();
    fileManager.write(JSON.stringify(req.body) + "\n");
    fileManager.flush();
    res.status(200).send("Logged");
  } catch (error) {
    res.status(500).send("Failed to log");
  } finally {
    await fileManager.close();
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
```

## API Documentation

[Docs](https://ocubist.github.io/file-stream-manager/)

## License

The File Stream Manager is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for more information.
