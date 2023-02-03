import express from 'express';
import bodyParser from "body-parser";
import cors from "cors";
import { Server } from 'socket.io';
import http from "http";

const app = express();
const server = http.createServer(app);
const port = 3000;

const io = new Server(server, {
    cors: {
        origin: '*'
    }
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors({
    origins: '*'
}))

app.get('/', (req, res) => {
    res.json({"hello": "world!"});
})

app.post('/api/control', (req, res) => {
    console.log(req.body);
    io.emit("control", req.body);
    res.send({"msg": "Data sent"});
})

io.on("connection", (socket) => {
    console.log(`New connection: ${socket.id}`);
    socket.emit("hello", "world");
})

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})