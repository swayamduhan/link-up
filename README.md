# LinkUp
A P2P WebRTC powered webapp that serves as a medium to talk to random strangers online. 

## Local Setup
1. spin up a terminal, `npm i` in backend folder. `tsc -b` to compile then `node dist/index.js` to start signalling server.
2. spin up another terminal, `npm i` in frontend folder then `npm run dev` to start local dev.

## Todo-
- Add re-negotiation logic to turn off/on camera & audio inbetween call.
- Add screen sharing.
- Add reactions during video chat.