import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import {
  attemptMiddleware,
  delayMiddleware,
  errorMiddleware,
} from "./middlewares";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(errorMiddleware);
app.use(delayMiddleware);
app.use(attemptMiddleware);

// Handle Different HTTP Methods
app.all("*", (req: Request, res: Response) => {
  const method = req.method;
  const headers = req.headers;
  const query = req.query;
  const body = req.body;

  // console.log({ req, body: req.body });

  // console.log({ method, headers, query, body });

  // Return the Retrieved Data
  res.json({
    method,
    headers,
    query,
    body,
  });
});

let server: any;

export const startServer = (port: number): Promise<void> => {
  return new Promise((resolve) => {
    server = app.listen(port, () => {
      // console.log(`Server is running on http://localhost:${port}`);
      resolve();
    });
  });
};

export const stopServer = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (server) {
      server.close((err: any) => {
        if (err) {
          console.error("Error while stopping the server", err);
          reject(err);
        } else {
          // console.log("Server stopped");
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
};
