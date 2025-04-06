import { useEffect, useRef, useState } from "react"
import { useChatStore } from "../store/chatStore"
import ChatStoreComponent from "./ChatStoreComponent"

export default function ChatComponent({ receivedVideo, dataChannelRef }: {receivedVideo : boolean, dataChannelRef: React.RefObject<RTCDataChannel | null>}){
    const [message, setMessage] = useState<string>("")
    const { chats, addChat, reset } = useChatStore()
    const sendButtonRef = useRef<HTMLButtonElement | null>(null)

    useEffect(() => {
        window.addEventListener("keydown", (e) => {
            if(e.key === "Enter" && receivedVideo){
                // press send button
                sendButtonRef.current?.click()
            }
        })
    }, [])

    useEffect(() => {
        if(!receivedVideo){
            reset()
        }
    }, [receivedVideo])

    return (
        <div className="border border-neutral-400/30 rounded-sm h-full p-4 flex flex-col gap-4">
            <div className="text-4xl">Stranger Chat</div>
            {receivedVideo ? (
                <div className="relative flex-1 font-montreal font-normal flex flex-col gap-4">
                    <ChatStoreComponent chats={chats}/>
                    <div className="h-14 bg-neutral-800 rounded-sm flex px-2 py-2 gap-2">
                        <input onChange={(e) => setMessage(e.target.value)} className="flex-1 rounded-sm px-2 focus:border focus:border-neutral-400/30 focus:outline-none"value={message}/>
                        <button className="border px-4 bg-neutral-100 text-neutral-900 rounded-sm" onClick={() => sendMessage(message, setMessage, addChat, dataChannelRef)} ref={sendButtonRef}>Send</button>
                    </div>
                </div>
            ) : (
                <div className="flex-1 overflow-hidden text-4xl max-h-[63vh] text-neutral-400/30">
                    {Array.from({length: 30}).map(() => (
                        <p className="inline">Waiting for stranger to connect <MinimalSVG /></p>
                    ))}
                </div>
            )}
        </div>
    )
}

function sendMessage(
    message : string, 
    setMessage: React.Dispatch<React.SetStateAction<string>>, 
    addChat: (message: string, type: "SENT" | "RECEIVED") => void, 
    dataChannelRef: React.RefObject<RTCDataChannel | null>
){
    if(message == "") return
    if(dataChannelRef.current){
        dataChannelRef.current.send(message)
    }
    addChat(message, "SENT")
    setMessage("")
}


function MinimalSVG(){
    return (
        <svg id="Layer_1" data-name="Layer 1" width={50} xmlns="http://www.w3.org/2000/svg" className="fill-neutral-400/30 inline" viewBox="100 100 300 300"><path d="M340.09,32.5c-85.35,206.05-94.83,206.05-180.18,0C245.26,238.55,238.55,245.26,32.5,159.91c206.05,85.35,206.05,94.83,0,180.18,206.05-85.35,212.76-78.64,127.41,127.41,85.35-206,94.83-206,180.18,0-85.35-206-78.64-212.76,127.41-127.41-206-85.35-206-94.83,0-180.18C261.45,245.26,254.74,238.55,340.09,32.5Z"/></svg>
    )
}