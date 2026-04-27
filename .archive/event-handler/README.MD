# Event Handler

## Description

The Event Handler library provides a robust and efficient way to manage custom events in JavaScript applications. It supports registering persistent (`on`) and one-time (`once`) event listeners, emitting events, and removing listeners. This library is optimized for performance and can handle a large number of listeners efficiently.

## Installation

To install the Event Handler, use npm or yarn:

```bash
npm install @ocubist/event-handler
# or
yarn add @ocubist/event-handler
```

## Usage

### Basic Example

```typescript
import { useEventHandler } from "@ocubist/event-handler";

const eventName = "myEvent";
const eventHandler = useEventHandler(eventName);

// Define a listener function
const listener = (data) => {
  console.log("Event data:", data);
};

// Register the listener using `on`
eventHandler.on(listener);

// Emit the event with some data
eventHandler.emit({ message: "Hello, world!" });
// Output: "Event data: { message: 'Hello, world!' }"

// Remove the listener
eventHandler.off(listener);

// Verify listener count
console.log(eventHandler.listenerCount()); // 0
```

### Advanced Example with POST Request

```typescript
import { useEventHandler } from "@ocubist/event-handler";

const eventName = "dataReceived";
const eventHandler = useEventHandler(eventName);

// Define a listener function to handle data
const dataListener = async (data) => {
  try {
    const response = await fetch("https://example.com/api/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log("POST response:", result);
  } catch (error) {
    console.error("Error posting data:", error);
  }
};

// Register the listener using `once`
eventHandler.once(dataListener);

// Emit the event with data to be sent in the POST request
eventHandler.emit({ key: "value" });
// The listener will send a POST request to "https://example.com/api/data" with the data
```

## API Documentation

[Docs](https://ocubist.github.io/event-handler/)

## License

The Event Handler is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for more information.
