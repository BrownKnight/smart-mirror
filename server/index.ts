import express from 'express';
// import socketIO from "socket.io";

import Weather from './api/weather'
import Calendar from './api/calendar';
import moment from 'moment';

export default (app, http) => {
  let weather = new Weather()
  
  app.use(express.json());
  
  app.get('/', (req, res) => {
    res.json({msg: 'root'});
  });
  
  app.get('/api', (req, res) => {
    res.json({msg: 'This is entry point of the API'});
  });
  
  app.get('/api/weather', (req, res) => {
    weather.getWeather().then((data) => {
      res.json(data);
    });
  });
  
  app.get('/api/calendar', async (req, res) => {
    let calender = new Calendar()
    let eventList = calender.getEvents(moment().startOf('day'), moment().startOf('day').add(2, 'days'));
    res.json(await eventList);
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
