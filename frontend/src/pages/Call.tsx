import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function Call() {
    const socketRef = useRef<Socket | null>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const [socketId, setSocketId] = useState<string | null>(null);
    const [userType, setUserType] = useState<"sender" | "receiver" | null>(null);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const roomIdRef = useRef<string | null>(null);
    const [receivedVideo, setReceivedVideo] = useState<boolean>(false);

    useEffect(() => {
        if(!socketRef.current){
            socketRef.current = io("http://localhost:8080");
            initSocketHandlers(socketRef.current);
        }
    }, []);

    const initSocketHandlers = useCallback((socket: Socket) => {
        socket.on("connect", () => {
            setSocketId(socket.id || "");
        });

        socket.on("disconnect", () => {
            console.log("disconnected from socket!")
        })

        socket.on("send-offer", async (roomId: string) => {
            // spin up a peer connection and send offer
            setUserType("sender");
            console.log("received room_id: ", roomId);
            roomIdRef.current = roomId;

            await initPeerConnection(roomId);

            // create offer, set local description and send offer
            console.log("sending offer")
            const offer = await peerConnectionRef.current?.createOffer()
            await peerConnectionRef.current?.setLocalDescription(offer)
            console.log("offer", offer)
            socketRef.current?.emit("offer", { offer, roomId })
        })

        socket.on("receive-offer", async (roomId: string) => {
            // spin up a peer connection and receive offer
            setUserType("receiver");
            console.log("waiting to receive offer")
            console.log("received room_id: ", roomId);
            roomIdRef.current = roomId;

            await initPeerConnection(roomId)
        })

        socket.on("answer", ({ answer } : { answer : RTCSessionDescriptionInit }) => {
            if(!peerConnectionRef.current) return;
            peerConnectionRef.current.setRemoteDescription(answer);
            console.log("answer received", answer)
        })

        socket.on("offer", async ({ offer } : { offer : RTCSessionDescriptionInit}) => {
            console.log("received offer", offer)
            if(!peerConnectionRef.current) return;

            // set remote description and send answer back
            peerConnectionRef.current.setRemoteDescription(offer);
            const answer = await peerConnectionRef.current.createAnswer()
            await peerConnectionRef.current.setLocalDescription(answer);
            socketRef.current?.emit("answer", { answer, roomId: roomIdRef.current })
            console.log("answer sent")

        })
        
        socket.on("add-ice-candidate", async ({ candidate } : { candidate : RTCIceCandidate }) => {
            if(!peerConnectionRef.current) return;
            await peerConnectionRef.current.addIceCandidate(candidate);
            console.log("ice candidate added", candidate)
        })

    }, []);

    const initPeerConnection = useCallback(async (roomId : string) => {
        if(!roomId){
            console.error("Room ID is not set");
            return;
        };
        await getUserMedia();

        const configuration : RTCConfiguration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
        const pc = new RTCPeerConnection(configuration);
        peerConnectionRef.current = pc;

        if(localStreamRef.current){
            localStreamRef.current.getTracks().forEach(track => {
                console.log("Adding local tracks to pc")
                //@ts-ignore
                pc.addTrack(track, localStreamRef.current);
            })
        }

        console.log("video set up done")

        pc.onicecandidate = (event) => {
            if(event.candidate){
                console.log("sending ice candidate", event.candidate)
                socketRef.current?.emit("send-ice-candidate", { candidate: event.candidate, roomId });
            }
        }

        pc.ontrack = (event: RTCTrackEvent) => {
            console.log("event streams: ", event.streams)
            if(remoteVideoRef.current){
                console.log("adding remote tracks")
                setReceivedVideo(true);
                remoteVideoRef.current.srcObject = event.streams[0];
            } else {
                console.log("remote video ref not found")
            }
        }



        pc.onnegotiationneeded = (event: Event) => {
            console.log("negotiation needed!")
            // to setup addition/removal of tracks
        }
        
    }, []);

    const getUserMedia = useCallback(async () => {
        try{
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            })
            localStreamRef.current = stream;
            if(localVideoRef.current){
                localVideoRef.current.srcObject = stream;
            }
        } catch(error){
            console.error("Error accessing media devices", error);
        }
    }, []);

    
    return (
        <div>
            <h1>Call</h1>
            <p>{socketId}</p>
            <p>You are a offer {userType || "________"}</p>
            <video id="localVideo" autoPlay playsInline controls={false} ref={localVideoRef}></video>
            <video id="remoteVideo" autoPlay playsInline controls={false} ref={remoteVideoRef} style={receivedVideo ? { display: "block" } : { display: "none" }}></video>
            {receivedVideo ? <p>Received video</p> : <p>Waiting for connection...</p>}
        </div>
    )
}

