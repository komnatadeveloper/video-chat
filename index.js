const express = require('express');
const ngrok = require('ngrok');
const socket = require("socket.io");
const app = express();

const server = app.listen(
  4000,
  () => {
    console.log('Server is runnning')
  }
);

app.use(
  express.static('public')
);

const io = socket(server);

io.on(
  'connection',
  (socket) => {
    console.log('User Connected with id of -> ', socket.id);

    socket.on(
      'join',
      (roomName) => {
        let rooms = io.sockets.adapter.rooms;
        console.log('socket.on -> join -> roomName ->', roomName);
        console.log('socket.on -> join -> rooms ->', rooms);
        // let room = io.sockets.adapter.rooms.get(roomName);
        let room = rooms.get(roomName);
        if ( !room ) {
          socket.join(roomName);
          socket.emit('created');
          console.log('socket.on -> join -> Room Created');
        }
        else if (room.size === 1 ) {
          socket.join(roomName);
          socket.emit('joined');
          console.log('socket.on -> join -> Joined to Room');
        }
        else {
          socket.emit('full');
          console.log('socket.on -> join -> Room' + roomName + ' is already full!');
        }
      }
    );  // End of socket.on('join)

    socket.on(
      'ready',
      ( roomName ) => {
        console.log('socket.on -> ready -> roomName -> ', roomName);
        socket.broadcast.to(roomName).emit('ready');
      }
    );
      
    socket.on(
      'candidate',
      ( candidate,  roomName ) => {
        console.log('candidate');
        socket.broadcast.to(roomName).emit('candidate', candidate);
      }
    );
      
    socket.on(
      'offer',
      ( offer,  roomName ) => {
        console.log('offer -> ');
        console.log(offer);
        // socket.broadcast.to(offer, roomName).emit('offer', offer);
        socket.broadcast.to(roomName).emit('offer', offer);
      }
    );
      
    socket.on(
      'answer',
      ( answer, roomName ) => {
        console.log('answer');
        socket.broadcast.to(roomName).emit('answer', answer);
      }
      );
      
      socket.on(
        'leave',
        ( roomName ) => {
          console.log('socket.on -> leave -> roomName -> ', roomName);
          socket.leave(roomName);
          socket.broadcast.to(roomName).emit('leave');
      }
    );



  }
);

ngrok.connect({
  addr: 4000  
})
  .then( 
    url => {
      console.log('ngrok url -> ', url);
    }
  )