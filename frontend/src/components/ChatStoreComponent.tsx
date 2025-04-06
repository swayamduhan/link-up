import { useEffect, useRef } from "react";
import { Chat } from "../store/chatStore";
import { motion } from "motion/react"

export default function ChatStoreComponent({ chats }: { chats: Chat[]}){

    const scrollableChatRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if(scrollableChatRef.current){
            scrollableChatRef.current.scrollTo({
                top: scrollableChatRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    }, [chats])

    return (
        <div ref={scrollableChatRef} className="relative flex-1 max-h-[55vh] overflow-y-auto flex flex-col-reverse gap-4">
            {chats.map((chat) => (
                <ChatBlob chat={chat} key={chat.id}/>
            ))}
        </div>
    )
}

function ChatBlob({ chat }: { chat: Chat }){
    return (
        <motion.div initial={{ y: 40, opacity: 0, filter: "blur(20px)" }} animate={{ y: 0, opacity: 1, filter: "blur(0px)" }} transition={{ duration: 0.2 }} className={`border relative max-w-[55%] break-words px-4 py-1 rounded-sm ${chat.type == "SENT" ? "self-end border-orange-300/50 shadow-[inset_0px_0px_10px_1px_#EF9C1E30]" : "self-start border-green-500/50 shadow-[inset_0px_0px_10px_1px_#1FE31130]"}`}>
            {chat.message}
        </motion.div>
    )
}