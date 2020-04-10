import express from 'express';
// import socketIO from "socket.io";

export default (app, http) => {
  app.use(express.json());
  
  app.get('/', (req, res) => {
    res.json({msg: 'root'});
  });
  app.get('/api', (req, res) => {
    res.json({msg: 'This is entry point of the API'});
  });
  //
  // app.post('/bar', (req, res) => {
  //   res.json(req.body);
  // });
  // 
  // optional support for socket.io
  // 
  // let io = socketIO(http);
  // io.on("connection", client => {
  //   client.on("message", function(data) {
  //     // do something
  //   });
  //   client.emit("message", "Welcome");
  // });
}
