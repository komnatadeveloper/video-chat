# Video Chat App

## To Run ->

- on Terminal write command
```
node index.js
```

- then copy the created url on terminal inside repoRoot/public/chat.js and change the code on Line 2 as:
```
let socket = io.connect('NGROK URL THAT YOU COPY FROM TERMINAL');
```

- Open browser and go to that NGROK URL

- Type  a Room Name and **Click Join**
- On another browser Tab or another Device Type the same Room Name and **Click Join**
- NOTE: You may have only 2 Peers connect. Multiple Peers are not available (at the moment)
  
  ## About NGROK
  - Since NGROK is a Service provided by NGROK, there are some connection limitations per minute. NGROK will warn if you exceed. You may use your own https URL if you have one.
  

- NOTE: I think there is a problem with Safari & Firefox. However, It works fine with Chrome.
- NOTE2: **Since there is not any  TURN Server, it may sometimes not work. For details, open google and search STUN Server & TURN Server**


## Some Screenshots

<img src="images-readmemd/1.png" height=400>


<img src="images-readmemd/2.png" height=400>


<img src="images-readmemd/3.png" height=400>

## Screenshot From Mobile Phone (Android)

<img src="images-readmemd/4.jpg" height=400>
