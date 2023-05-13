"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
    }
});
const route_1 = __importDefault(require("./route/route"));
// Define the WebSocket route
(0, route_1.default)(io);
// Start the server
const port = process.env.PORT || 4000;
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
//get request when server is live
app.get('/', (req, res) => {
    //These Request and Response types are used to provide type information for the req and res parameters in the route handler.
    res.status(200).json('Server is Live');
});
