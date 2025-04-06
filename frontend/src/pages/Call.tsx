import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import CallComponent from "../components/CallComponent";
import "./call.css"
import { useChatStore } from "../store/chatStore";
import { useNavigate } from "react-router-dom";


// TODO: fix skip button logic, not working on receiving user


export default function Call() {
    const socketRef = useRef<Socket | null>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const remoteStreamRef = useRef<MediaStream | null>(null)
    const roomIdRef = useRef<string | null>(null);
    const [receivedVideo, setReceivedVideo] = useState<boolean>(false);
    const [localStreamSetup, setLocalStreamSetup] = useState<boolean>(false);
    const dataChannelRef = useRef<RTCDataChannel | null>(null)
    const { addChat } = useChatStore()
    const navigate = useNavigate()


    // WORKFLOW : don't connect to the socket until local stream setup is done
    useEffect(() => {
        initLocalStream();
        if(localStreamSetup && !socketRef.current){
            socketRef.current = io("http://localhost:8080");
            initSocketHandlers(socketRef.current);
        }
    }, [localStreamSetup]);

    useEffect(() => {
        if(receivedVideo && remoteVideoRef.current && localVideoRef.current){
            remoteVideoRef.current.srcObject = remoteStreamRef.current
            localVideoRef.current.srcObject = localStreamRef.current
        } else if(!receivedVideo && localVideoRef.current){
            localVideoRef.current.srcObject = localStreamRef.current
        } else {
            console.log("unable to add remote stream :(")
        }
    }, [receivedVideo])

    const initLocalStream = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            })
            localStreamRef.current = stream;
            if(localVideoRef.current){
                localVideoRef.current.srcObject = stream;
                setLocalStreamSetup(true);
            }
        } catch (err) {
            alert("Error accessing media devices" + err);
        }
    }, []);

    const initSocketHandlers = useCallback((socket: Socket) => {
        socket.on("connect", () => {
            console.log("connected to socket")
        });

        socket.on("disconnect", () => {
            console.log("disconnected from socket!")
        })

        socket.on("send-offer", async (roomId: string) => {
            // spin up a peer connection and send offer
            console.log("received room_id: ", roomId);
            roomIdRef.current = roomId;

            const pc = await initPeerConnection(roomId);
            if(pc){
                initDataChannel(pc)
            } else {
                console.error("couldn't setup data channel, pc not found")
            }

            // create offer, set local description and send offer
            console.log("sending offer")
            const offer = await peerConnectionRef.current?.createOffer()
            await peerConnectionRef.current?.setLocalDescription(offer)
            console.log("offer", offer)
            socketRef.current?.emit("offer", { offer, roomId })
        })

        socket.on("receive-offer", async (roomId: string) => {
            // spin up a peer connection and receive offer
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

        socket.on("room-disconnect", () => {
            peerConnectionRef.current = null
            remoteStreamRef.current = null
            roomIdRef.current = null
            setReceivedVideo(false)
        })

        socket.on("peer-skipped", () => {
            setReceivedVideo(false)
            peerConnectionCleanup()
        })

    }, []);

    const initPeerConnection = useCallback(async (roomId : string) => {
        if(!roomId){
            console.error("Room ID is not set");
            return;
        };

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

        pc.ondatachannel = (e) => {
            const dc = e.channel
            dataChannelRef.current = dc

            dc.onmessage = (e) => {
                addChat(e.data, "RECEIVED")
            }

            dc.onopen = () => {
                console.log("data channel connected by receiver!")
            }
        }

        pc.onicecandidate = (event) => {
            if(event.candidate){
                console.log("sending ice candidate", event.candidate)
                socketRef.current?.emit("send-ice-candidate", { candidate: event.candidate, roomId });
            }
        }

        pc.ontrack = (event: RTCTrackEvent) => {
            console.log("event streams: ", event.streams)
            remoteStreamRef.current = event.streams[0]
            setReceivedVideo(true)
        }



        // pc.onnegotiationneeded = (event) => {
        //     console.log("negotiation needed!")
        // }
        
        return pc
    }, []);

    const initDataChannel = useCallback((pc : RTCPeerConnection) => {
        console.log("setting up a dc")
        const dc = pc.createDataChannel("chat-channel")
        dataChannelRef.current = dc

        dc.onopen = () => {
            console.log("data channel opened by offer sender!")
        }

        dc.onmessage = (e) => {
            console.log("received message: ", e.data)
            addChat(e.data, "RECEIVED")
        }
    }, [])

    function handleSkip(){
        if(!receivedVideo){
            console.log("unwanted skip")
            return
        }

        if(socketRef.current){
            socketRef.current.emit("skip", { roomId: roomIdRef.current })
        }

        peerConnectionCleanup()
        setReceivedVideo(false)
    }

    function handleBack(){
        // remove socket connection
        if(socketRef.current){
            socketRef.current.disconnect()
        }

        // cleanup peer connection
        peerConnectionCleanup()

        // remove local media
        if(localStreamRef.current){
            localStreamRef.current.getTracks().forEach(track => {
                localStreamRef.current?.removeTrack(track)
                track.stop()
            })
            localStreamRef.current = null
        }

        navigator.mediaDevices.getUserMedia({ video: false, audio: false })
        .then((stream) => {
            stream.getTracks().forEach(track => track.stop());
        })
        .catch(() => {})

        // link back to home
        navigate("/")
    }

    function peerConnectionCleanup(){
        if(remoteStreamRef.current){
            remoteStreamRef.current.getTracks().forEach(track => track.stop())
            remoteStreamRef.current = null
        }
        
        if(dataChannelRef.current){
            dataChannelRef.current.close()
            dataChannelRef.current.onmessage = null
            dataChannelRef.current.onopen = null
            dataChannelRef.current = null
        }
        
        if(peerConnectionRef.current){
            peerConnectionRef.current.close()
            peerConnectionRef.current.onicecandidate = null
            peerConnectionRef.current.ondatachannel = null
            peerConnectionRef.current.ontrack = null
            peerConnectionRef.current.onnegotiationneeded = null
            peerConnectionRef.current = null
        }

        roomIdRef.current = null
    }
        
    
    return (
        <div className="font-thin w-full min-h-screen bg-neutral-900 text-neutral-100">
            <div className="max-w-[2000px] h-full">
                {/* Subtle Navbar with Name */}
                <div className="min-h-screen flex flex-col">
                    <div className="relative text-center pt-4 text-3xl">
                        LinkUp<span className="absolute top-3 text-sm">&reg;</span>
                    </div>
                    {/* main content */}
                    <CallComponent handleBack={handleBack} handleSkip={handleSkip} localStreamRef={localStreamRef} remoteStreamRef={remoteStreamRef} localVideoRef={localVideoRef} remoteVideoRef={remoteVideoRef} receivedVideo={receivedVideo} dataChannelRef={dataChannelRef} />
                </div>

                {/* footer on scroll */}
                <footer>Hello this is footer</footer>
            </div>
        </div>
    )
}

