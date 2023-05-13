import express from 'express';

//In the TypeScript code, we import the types Request and Response from the express package. 
import { Request, Response } from "express";

import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

import handleSocketIO from './route/route';
// Define the WebSocket route
handleSocketIO(io);


// Start the server
const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

//get request when server is live
app.get('/', (req: Request, res: Response) => {
    //These Request and Response types are used to provide type information for the req and res parameters in the route handler.
    res.status(200).json('Server is Live');
});

export default app;