// let socket = io.connect("http://localhost:4000");
let socket = io.connect("https://3bc549e06802.ngrok.io/");
// let socket = io.connect("https://4947eeefdb73.ngrok.io");
// let socket = io.connect("http://192.168.1.29:4000");
let divVideoChatLobby = document.getElementById("video-chat-lobby");
let divVideoChat = document.getElementById("video-chat-room");
let joinButton = document.getElementById("join");
let userVideo = document.getElementById("user-video");
let peerVideo = document.getElementById("peer-video");
let roomInput = document.getElementById("roomName");

let divButtonGroup = document.getElementById('btn-group')
let muteButton = document.getElementById("muteButton");
let hideCameraButton = document.getElementById("hideCameraButton");
let leaveRoomButton = document.getElementById("leaveRoomButton");
let muteFlag = false;
let hideCameraFlag = false;

let roomName = roomInput.value;
let creator = false; // to help us know we are the creator or joiner to room
let rtcPeerConnection;
let userStream;

let iceServers = {
  iceServers: [
    {
      urls: "stun:stun.services.mozilla.com",
    },
    {
      urls: "stun:stun3.l.google.com:19302"
    },
    // {
    //   urls: "turn:turn01.hubl.in?transport=udp"
    // },
  ]
}

joinButton.addEventListener(
  'click',
  async ( ) => {
    if ( roomInput.value == '') {
      alert('please enter a room name')
    }
    else {      
      socket.emit(
        'join',
        roomInput.value
        // roomName
      );
      
    }
  }
);  // End of joinButton.addEventListener( 'click',


muteButton.addEventListener(
  'click',
  async ( ) => {
    muteFlag = !muteFlag;
    if(muteFlag) {
      userStream.getTracks()[0].enabled = false;
      muteButton.textContent = 'UnMute';
    } else {
      userStream.getTracks()[0].enabled = true;
      muteButton.textContent = 'Mute';
    }
  }
  );  // End of muteButton.addEventListener( 'click',
  
  hideCameraButton.addEventListener(
    'click',
    async ( ) => {
      hideCameraFlag = !hideCameraFlag;
      if(hideCameraFlag) {
        userStream.getTracks()[1].enabled = false;
        hideCameraButton.textContent = 'Show Camera';
      } else {
        userStream.getTracks()[1].enabled = true;
        hideCameraButton.textContent = 'Hide Camera';
      }
  }
);  // End of hideCameraButton.addEventListener( 'click',

socket.on(
  'created',
  async ( ) => {
    console.log('socket.on -> created -> FIRED')
    creator = true;
    navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: { width: 200, height: 113 },
    })
    .then(function (stream) {
      /* use the stream */
      userStream = stream;
      divVideoChatLobby.style = "display:none";
      divButtonGroup.style = "display:flex";
      userVideo.srcObject = stream;
      userVideo.onloadedmetadata = function (e) {
        userVideo.play();
      };
    })
    .catch(function (err) {
      /* handle the error */
      alert("Couldn't Access User Media");
    });
  }
);

socket.on(
  'joined',
  async ( ) => {
    console.log('socket.on -> joined -> FIRED')
    creator = false;
    navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: { width: 200, height: 113 },
    })
    .then(function (stream) {
      /* use the stream */
      userStream = stream;
      divVideoChatLobby.style = "display:none";
      divButtonGroup.style = "display:flex";
      userVideo.srcObject = stream;
      userVideo.onloadedmetadata = function (e) {
        userVideo.play();
      };
      socket.emit("ready", roomInput.value);
      console.log('EMITTED -> ready event -> roomName ->', roomInput.value)
    })
    .catch(function (err) {
      /* handle the error */
      alert("Couldn't Access User Media");
    });
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
    console.log('socket.on -> ready -> FIRED -> Am I Creator -> ', creator);
    if ( creator ) {
      rtcPeerConnection = new RTCPeerConnection(
        iceServers
      );
      rtcPeerConnection.onicecandidate = OnIceCandidateFunction;
      rtcPeerConnection.ontrack = OnTrackFunction;
      setTimeout(
       () => {

      },
      1500
      );
      rtcPeerConnection.addTrack(
        userStream.getTracks()[0],
        userStream,
      );
      rtcPeerConnection.addTrack(
        userStream.getTracks()[1],
        userStream,
      );
      rtcPeerConnection.createOffer(
        // success case:
        ( offer  ) => {
          console.log('socket.on -> ready -> createOffer -> success -> offer -> ', offer);
          rtcPeerConnection.setLocalDescription(
            offer
          );
          socket.emit(
            'offer',
            offer,
            roomInput.value
          );
          console.log('You have emitted offer -> offer ->', offer);
        },
        // fail case:
        ( error ) => {
          console.log('socket.on -> ready -> createOffer -> error -> ', error);
        },
      );
    }
  }
);
socket.on(
  'candidate',
  ( candidate ) => {
    console.log('socket.on -> candidate -> candidate -> ', candidate);
    let iceCandidate = new RTCIceCandidate(candidate);
    rtcPeerConnection.addIceCandidate(
      iceCandidate
    );
  }
);

socket.on(
  'offer',
  async ( offer ) => {
    try {      
      console.log('socket.on -> offer -> ', offer);
      console.log('Am I Creator ? -> ', creator);
      // if ( !creator ) {
        console.log('1')
        rtcPeerConnection = new RTCPeerConnection(
          iceServers
        );
        console.log('1.1')
        rtcPeerConnection.onicecandidate = OnIceCandidateFunction;
        rtcPeerConnection.ontrack = OnTrackFunction;
        console.log('1.2')
        rtcPeerConnection.addTrack(
          userStream.getTracks()[0],
          userStream,
        );
        console.log('1.3')
        rtcPeerConnection.addTrack(
          userStream.getTracks()[1],
          userStream,
        );
        console.log('1.4')
        rtcPeerConnection.setRemoteDescription(
          offer
        );
        console.log('1.5')
        // console.log('rtcPeerConnection -> ', rtcPeerConnection)
        await rtcPeerConnection.createAnswer(
          // success case:
          function (answer) {
            console.log('2')
            console.log('socket.on -> offer -> createAnswer -> success -> answer -> ', answer);
            rtcPeerConnection.setLocalDescription(
              answer
            );
            console.log('3')
            
            socket.emit(
              'answer',
              answer,
              roomInput.value
            );
            console.log('4')
          },
          // fail case:
          ( error ) => {
            console.log('socket.on -> offer -> createAnswer -> error -> ', error);
          },
        );
      // }
    } catch (err) {
      console.log('socket.on -> offer -> errors -> ', err);
    }
  }
);

// socket.on("offer", function (offer) {
//   if (!creator) {
//     rtcPeerConnection = new RTCPeerConnection(iceServers);
//     rtcPeerConnection.onicecandidate = OnIceCandidateFunction;
//     rtcPeerConnection.ontrack = OnTrackFunction;
//     rtcPeerConnection.addTrack(userStream.getTracks()[0], userStream);
//     rtcPeerConnection.addTrack(userStream.getTracks()[1], userStream);
//     rtcPeerConnection.setRemoteDescription(offer);
//     rtcPeerConnection.createAnswer(
//       function (answer) {
//         rtcPeerConnection.setLocalDescription(answer);
//         socket.emit("answer", answer, roomName);
//       },
//       function (error) {
//         console.log(error);
//       }
//     );
//   }
// });


socket.on(
  'answer',
  ( 
    answer // this is Session Description from CALLEE to CALLER
  ) => {
    console.log('socket.on -> answer FIRED -> answer -> ', answer);
    rtcPeerConnection.setRemoteDescription(
      answer
    );
  }
);


leaveRoomButton.addEventListener(
  'click',
  async ( ) => {
    socket.emit(
      'leave',
      roomInput.value
    );
    divVideoChatLobby.style = "display:block";
    divButtonGroup.style = "display:none";
    if(userVideo.srcObject) {
      userVideo.srcObject.getTracks()[0].stop();
      userVideo.srcObject.getTracks()[1].stop();
    }
    if(peerVideo.srcObject) {
      peerVideo.srcObject.getTracks()[0].stop();
      peerVideo.srcObject.getTracks()[1].stop();
    }
    
    if( rtcPeerConnection ) {
      rtcPeerConnection.ontrack = null;
      rtcPeerConnection.onicecandidate = null;
      rtcPeerConnection.close();
      rtcPeerConnection = null;
    }
  }
  );  // End of leaveRoomButton.addEventListener( 'click',
  socket.on(
    'leave',
    ( ) => {
      creator = true; // now he is creator because he is the only one in this room
      if(peerVideo.srcObject) {
        peerVideo.srcObject.getTracks()[0].stop();
        peerVideo.srcObject.getTracks()[1].stop();
      }
      if( rtcPeerConnection ) {
        rtcPeerConnection.ontrack = null;
        rtcPeerConnection.onicecandidate = null;
        rtcPeerConnection.close();
        rtcPeerConnection = null;
      }

  }
);

const OnIceCandidateFunction = ( event ) => {
  console.log('OnIceCandidateFunction -> FIRED -> event -> ', event);
  if ( event.candidate ) {
    socket.emit(
      'candidate',
      event.candidate,
      roomInput.value
    )
    console.log('OnIceCandidateFunction -> you have socket.EMITTED candidate');
  }
}

const OnTrackFunction = ( event ) => {
  console.log('OnTrackFunction Function Fired ->  ');
  console.log('OnTrackFunction Function Fired -> event -> ', event);
  // if ( event.candidate ) {
    peerVideo.srcObject = event.streams[0];
    peerVideo.onloadedmetadata = function ( e ) {
      peerVideo.play();
    }
  // }
}