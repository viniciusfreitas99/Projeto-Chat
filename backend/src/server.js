const { WebSocketServer } = require("ws");
const dotenv = require("dotenv");

dotenv.config();

const wss = new WebSocketServer({ port: 9854 });

wss.on("connection", (ws) => {
    ws.on("error", (error) => {
        console.error(`WebSocket error: ${error}`);
    });



    ws.on("message", (message) => {
        console.log(`Mensagem recebida: ${message}`);
        // Aqui você pode processar a mensagem recebida de acordo com suas necessidades
    });
});

console.log("Conectado ao servidor WebSocket");
