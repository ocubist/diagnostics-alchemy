export const extractAllProperties = (err: Error): Record<string, any> => {
  const errorObject: Record<string, any> = {};
  const seenObjects = new Set<object>(); // Track circular references

  const addProperties = (obj: any) => {
    console.log(`Processing object:`, obj); // Log the current object being processed

    Object.keys(obj).forEach((key) => {
      if (!(key in errorObject)) {
        try {
          const value = obj[key];
          console.log(`Adding property "${key}":`, value); // Log added properties
          if (typeof value !== "function") {
            errorObject[key] = value;
          } else {
            console.log(`Skipping function property "${key}"`);
          }
        } catch (e) {
          console.log(`Error accessing property "${key}":`, e); // Log errors for unreadable properties
          errorObject[key] = "[Unreadable Property]";
        }
      } else {
        console.log(`Property "${key}" already processed, skipping.`);
      }
    });
  };

  let currentObj: any = err;

  // Traverse the prototype chain, stopping at Object.prototype
  while (currentObj && currentObj !== Object.prototype) {
    if (seenObjects.has(currentObj)) {
      console.log(`Circular reference detected for object:`, currentObj); // Log circular reference
      break;
    }
    seenObjects.add(currentObj);
    addProperties(currentObj);
    currentObj = Object.getPrototypeOf(currentObj);
  }

  console.log(`Final extracted properties:`, errorObject); // Log the final result
  return errorObject;
};
