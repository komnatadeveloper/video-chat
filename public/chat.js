let socket = io.connect("http://localhost:4000");
// let socket = io.connect("http://192.168.1.29:4000");
let divVideoChatLobby = document.getElementById("video-chat-lobby");
let divVideoChat = document.getElementById("video-chat-room");
let joinButton = document.getElementById("join");
let userVideo = document.getElementById("user-video");
let peerVideo = document.getElementById("peer-video");
let roomInput = document.getElementById("roomName");
let roomName = roomInput.value;
let creator = false; // to help us know we are the creator or joiner to room

joinButton.addEventListener(
  'click',
  async ( ) => {
    if ( roomInput.value == '') {
      alert('please enter a room name')
    }
    else {      
      socket.emit(
        'join',
        // roomInput.value
        roomName
      );
      
    }
  }
);  // End of joinButton.addEventListener( 'click',

socket.on(
  'created',
  ( ) => {
    creator = true;
    let stream = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia(
        // constraints
        {
          audio: true,
          video: {
            width: 1280,
            height: 720
          },
          // or maybe video: true would be easier & simpler
        }
      );
      userVideo.srcObject = stream;
      userVideo.onloadedmetadata = ( e ) => {
        userVideo.play();
      }
      divVideoChatLobby.style = ('display:none');
    } catch (err) {
      console.log('Error -> ', err);
      alert('Couldnt access User Media!');
    }
  }
);
socket.on(
  'joined',
  ( ) => {
    creator = false;
    let stream = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia(
        // constraints
        {
          audio: true,
          video: {
            width: 1280,
            height: 720
          },
          // or maybe video: true would be easier & simpler
        }
      );
      userVideo.srcObject = stream;
      userVideo.onloadedmetadata = ( e ) => {
        userVideo.play();
      }
      divVideoChatLobby.style = ('display:none');
    } catch (err) {
      console.log('Error -> ', err);
      alert('Couldnt access User Media!');
    }
  }
);
socket.on(
  'full',
  ( ) => {
    alert('Room is full! Can\'t join');
  }
);
socket.on(
  'ready',
  ( ) => {

  }
);
socket.on(
  'candidate',
  ( ) => {

  }
);
socket.on(
  'offer',
  ( ) => {

  }
);
socket.on(
  'answer',
  ( ) => {

  }
);