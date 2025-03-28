import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function Call() {
    const socketRef = useRef<Socket | null>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const [socketId, setSocketId] = useState<string | null>(null);
    const [roomId, setRoomId] = useState<string | null>(null);
    

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

        socket.on("room_id", (roomId: string) => {
            // spin up a peer connection and send offer
            setRoomId(roomId);
            console.log("room_id", roomId);

            initPeerConnection();
        })

        socket.on("offer", (offer: RTCSessionDescriptionInit) => {
            console.log("offer", offer);

            if(!peerConnectionRef.current) return;

            peerConnectionRef.current.setRemoteDescription(offer);
        })

    }, []);

    const initPeerConnection = useCallback(() => {
        if(!roomId) return;

        const configuration : RTCConfiguration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
        const peerConnection = new RTCPeerConnection(configuration);
        peerConnectionRef.current = peerConnection;
        
    }, [roomId]);
    
    return (
        <div>
            <h1>Call</h1>
            <p>{socketId}</p>
        </div>
    )
}

