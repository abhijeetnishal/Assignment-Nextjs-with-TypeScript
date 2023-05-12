import { Server, Socket } from "socket.io";
//In the TypeScript code, we import the Server and Socket types from the "socket.io" module.
import getAllFunctions from '../controller/controller'

function handleSocketIO(io: Server){
    io.on("connection", (socket: Socket) => {
        console.log("Client connected");
        
        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
        
        //quotes endpoint
        socket.on("getQuotes", async () => {
            const data = await getAllFunctions.getAllData();
            socket.emit("quotes", data);
        });
        
        //average endpoint
        socket.on("getAverage", async () => {
            const average = await getAllFunctions.getAverage();
            socket.emit("average", { value: average });
        });
        
        //slippage endpoint
        socket.on("getSlippage", async () => {
            const slippageData = await getAllFunctions.getSlippage();
            socket.emit("slippage", slippageData);
        });
    });
}

export default handleSocketIO;  