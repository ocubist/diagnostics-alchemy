import express, { Request, Response, NextFunction } from "express";

let attempt = 1;

// const raiseAttempt = () => {
//   attempt = ((attempt + 1) % 5) + 1;
// };

// Delay Middleware
export const delayMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const delay = parseInt(req.query.delay as string, 10);

  if (!isNaN(delay) && delay > 0) {
    setTimeout(() => {
      next();
    }, delay);
  } else {
    next();
  }
};

// Error Middleware
export const errorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const err500 = req.query.err500;

  if (err500 === "true") {
    res.status(500).json({ error: "Internal Server Error" });
  } else {
    next();
  }
};

export const attemptMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const attemptTest = Number.parseInt(req.query.attemptTest as string, 10);

  if (attemptTest && Number.isInteger(attemptTest)) {
    if (attempt === attemptTest) {
      next();
    } else {
      attempt++;
    }
  } else {
    next();
  }
};
