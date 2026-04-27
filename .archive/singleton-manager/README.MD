# Singleton Manager

## Description

A simple but effective Singleton-Manager.

## Installation

To install the Singleton Manager, use npm or yarn:

```bash
npm install @ocubist/singleton-manager
# or
yarn add @ocubist/singleton-manager
```

## Usage

### Basic Example

```typescript
import { useSingleton } from "@ocubist/singleton-manager";

// Create a singleton manager for "myGroup"
const singletonManager = useSingleton("myGroup");

// Define a singleton
singletonManager.setSingleton("mySingleton", { value: 42 });

// Retrieve the singleton
const mySingleton = singletonManager.getSingleton<{ value: number }>(
  "mySingleton"
);
console.log(mySingleton.value); // Output: 42

// Check if a singleton exists
const exists = singletonManager.hasSingleton("mySingleton");
console.log(exists); // Output: true

// Remove a singleton
singletonManager.removeSingleton("mySingleton");
```

### Advanced Example with POST Request

```typescript
import { useSingleton } from "@ocubist/singleton-manager";
import axios from "axios";

// Create a singleton manager for "apiGroup"
const apiSingletonManager = useSingleton("apiGroup");

// Function to make a POST request
const postRequest = async (url: string, data: object) => {
  const response = await axios.post(url, data);
  return response.data;
};

// Define and store a singleton for the POST request function
apiSingletonManager.setSingleton("postRequest", postRequest);

// Retrieve and use the singleton to make a POST request
const postFunction =
  apiSingletonManager.getSingleton<(url: string, data: object) => Promise<any>>(
    "postRequest"
  );

postFunction("https://example.com/api", { key: "value" })
  .then((response) => console.log(response))
  .catch((error) => console.error(error));
```

## API Documentation

[Docs](https://ocubist.github.io/singleton-manager/)

## License

The Singleton Manager is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for more information.
