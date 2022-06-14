import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = new Set();

let anonymouseCount = 0;

function makeMessage(nick, message) {
  return JSON.stringify({ nick, message });
}

wss.on("connection", (socket) => {
  sockets.add(socket);

  let nick = `Anonymouse#${++anonymouseCount}`;

  socket.on("message", (message) => {
    const parsed = JSON.parse(message);
    switch (parsed.type) {
      case "new_message":
        sockets.forEach((aSocket) =>
          aSocket.send(makeMessage(nick, parsed.payload))
        );
        break;
      case "nickname":
        nick = parsed.payload;
        break;
      default:
        console.log("Should not reach here.");
    }
  });
});

server.listen(process.env.PORT, handleListen);