"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//In the TypeScript code, we import the Server and Socket types from the "socket.io" module.
const controller_1 = __importDefault(require("../controller/controller"));
function handleSocketIO(io) {
    io.on("connection", (socket) => {
        console.log("Client connected");
        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
        //quotes endpoint
        socket.on("getQuotes", () => __awaiter(this, void 0, void 0, function* () {
            const data = yield controller_1.default.getAllData();
            socket.emit("quotes", data);
        }));
        //average endpoint
        socket.on("getAverage", () => __awaiter(this, void 0, void 0, function* () {
            const average = yield controller_1.default.getAverage();
            socket.emit("average", { value: average });
        }));
        //slippage endpoint
        socket.on("getSlippage", () => __awaiter(this, void 0, void 0, function* () {
            const slippageData = yield controller_1.default.getSlippage();
            socket.emit("slippage", slippageData);
        }));
    });
}
exports.default = handleSocketIO;
