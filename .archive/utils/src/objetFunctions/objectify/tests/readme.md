# Test Kit Todo List for simplifyData

## Basic Values

- [x] Should handle primitive values
- [x] Should handle unexpected inputs gracefully

## Objects

- [x] Should handle simple objects
- [x] Should handle nested objects up to the depth limit
- [x] Should handle deeply nested objects with circular references

## Errors

- [ ] Should handle error objects and extract properties
- [ ] Should filter compiler stack trace lines
- [ ] Should stop filtering stack trace after the first clean line
- [ ] Should handle nested errors up to the depth limit

## Arrays and Mixed Types

- [ ] Should handle arrays and nested arrays correctly

## Deterministic Key Order

- [ ] Should produce consistent key order for objects
- [ ] Should produce consistent key order for nested objects

## Additional Tests

- [ ] Should handle mixed types in objects (primitives, arrays, and nested objects)
- [ ] Should handle deeply nested structures exceeding depth limit
- [ ] Should handle circular references in errors
- [ ] Should handle large and complex data structures efficiently
