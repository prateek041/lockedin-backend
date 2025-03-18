import express from 'express';
import { createServer } from 'node:http';
import { Server, Socket } from 'socket.io';
import { writeFileSync } from 'node:fs';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.get('/ping', (req, res) => {
  res.status(200).json({ message: "pong" })
});

io.on('connection', (socket: Socket) => {
  console.log('Client connected');
  const chunks: Buffer[] = [];

  socket.on('audio', (data: ArrayBuffer) => {
    console.log('Received audio chunk');
    chunks.push(Buffer.from(data));
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    if (chunks.length > 0) {
      writeFileSync('received_audio.webm', Buffer.concat(chunks));
      console.log('Audio file saved');
    }
  });
}); httpServer.listen(9090, () => {
  console.log('server running at http://localhost:9090');
});
