import { useEffect, useRef, useState } from "react"
import SidebarButton from "./SidebarButton"
import { AnimatePresence, LayoutGroup, motion } from "motion/react"
import ChatComponent from "./ChatComponent"
    
export default function CallComponent({
    localStreamRef,
    remoteStreamRef,
    localVideoRef,
    remoteVideoRef,
    receivedVideo,
    dataChannelRef,
    handleSkip,
    handleBack
}: { 
    localStreamRef: React.RefObject<MediaStream | null>, 
    remoteStreamRef: React.RefObject<MediaStream | null>, 
    localVideoRef: React.RefObject<HTMLVideoElement | null>, 
    remoteVideoRef: React.RefObject<HTMLVideoElement | null>, 
    receivedVideo: boolean, 
    dataChannelRef: React.RefObject<RTCDataChannel | null> ,
    handleSkip: () => void,
    handleBack: () => void
}) {

    const [chatOpen, setChatOpen] = useState<Boolean>(false)
    const constraintsRef = useRef<HTMLDivElement>(null)
    const [constraints, setConstraints] = useState<any>({ top: 0, left: 0, right: 0, bottom: 0})

    //  explicitly setting constraints
    useEffect(() => {
        if (constraintsRef.current && localVideoRef.current) {
            const parentRect = constraintsRef.current.getBoundingClientRect();
            const childRect = localVideoRef.current.getBoundingClientRect();
    
            setConstraints({
            top: 0,
            left: 0,
            right: parentRect.width - childRect.width,
            bottom: parentRect.height - childRect.height,
            });
        }
    }, [receivedVideo]);

    useEffect(() => {
        if(localVideoRef.current){
            localVideoRef.current.srcObject = localStreamRef.current
        } else {
            console.log("could not find local video brah")
        }
        if(remoteVideoRef.current){
            remoteVideoRef.current.srcObject = remoteStreamRef.current
        }
    }, [chatOpen])

    useEffect(() => {
        console.log("CHAT STATE CHANGED")
        // set local video and remote video again on state change because of component re mount
    }, [chatOpen])

    function handleChatOpen(){
        setChatOpen(true)
    }

    return (
        <main className="flex flex-1 overflow-x-hidden">
        <LayoutGroup>
        <AnimatePresence mode="wait">
        {chatOpen ? (
            <>
            <motion.div key="video-component" layoutId="video-component" className="relative flex-1 p-4 grid grid-rows-2">
                <div className="absolute h-[75%] right-0 border mt-28 border-neutral-400/30"></div>
                <motion.div className="flex items-center justify-center">
                    {/* REMOTE VIDEO CONTAINER */}
                    {receivedVideo ? 
                        <motion.div layoutId="remote-container" layout="position" className="w-4/5 h-[400px] mx-auto relative">
                            <video key="remote-video" id="remoteVideo" className="rounded-sm w-full h-full object-cover" autoPlay playsInline controls={false} ref={remoteVideoRef} />
                        </motion.div>
                        :
                        <motion.div layout="position" layoutId="waiting-conn" className="text-2xl">Waiting for connection...</motion.div>
                    }
                </motion.div>
                <motion.div className="flex items-center justify-center">
                    {/* LOCAL VIDEO CONTAINER */}
                    <motion.div layoutId="local-container" className="w-4/5 h-[400px] mx-auto relative">
                        <video key="local-video" id="localVideo" className="rounded-sm w-full h-full object-cover" autoPlay playsInline controls={false} ref={localVideoRef}></video>
                    </motion.div>
                </motion.div>
            </motion.div>
            <motion.div layoutId="chat-component" key="chat-component" className="flex-1 p-4 flex flex-col">
                <div className="flex-5 flex">
                    <div className="flex-1 relative">
                        <motion.button key="show-chat-btn" layout="position" layoutId="chat-state-btn" className="flex-1 absolute inset-0  border-neutral-400 group cursor-pointer" onClick={() => setChatOpen(false)}>
                            <div className="text-5xl rotate-270 flex items-center gap-4 text-nowrap justify-center">
                                <div>Close Chat</div>
                                <motion.div className="group-hover:rotate-90 transition-all duration-300"><Y2K_Diamond /></motion.div>
                            </div>
                        </motion.button>
                    </div>
                    <motion.div layout={false} layoutId="main-chat" className="flex-6 p-4">
                        <ChatComponent receivedVideo={receivedVideo} dataChannelRef={dataChannelRef} />
                    </motion.div>
                </div>
                <motion.div layout="position" layoutId="btn-container" className="relative flex-1 flex justify-around items-center text-3xl gap-10 px-10">
                    <SidebarButton onClick={handleSkip} layoutId="skip-btn" label="Skip" />
                    <SidebarButton layoutId="pause-btn" label="Pause" />
                    <SidebarButton onClick={handleBack} layoutId="back-btn" label="Back" />
                </motion.div>
            </motion.div>
            </>
        ) : (
            <>
                {/* Main Call When Chat Closed */}
                <motion.div layoutId="video-component" className="max-h-full flex-1 p-4 text-4xl">
                    {/* Wait for receivedVideo until then show a waiting and zoomed in local video */}
                    {receivedVideo ? (
                        // Received Video Container
                        // Remote video on full screen
                        // local video draggable on top of it
                        <motion.div className="h-full w-full relative p-8">
                            <motion.div layoutId="remote-container" layout="position">
                                <video key="remote-video" id="remoteVideo" className="absolute top-0 left-0 h-full w-full object-cover" autoPlay playsInline controls={false} ref={remoteVideoRef} />
                            </motion.div>
                            
                            {/* drag constraint div for local video */}
                            <motion.div ref={constraintsRef} className="absolute inset-6">
                                {/* div to contain local video */}
                                <motion.div drag dragConstraints={constraints} layoutId="local-container" className="relative h-[250px] w-[400px]" style={{ boxShadow : "0px 0px 14px 2px rgb(0,0,0,0.3)"}}>
                                    <video key="local-video" id="localVideo" className="w-full h-full object-cover" autoPlay playsInline controls={false} ref={localVideoRef}></video>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <div className="h-full border border-neutral-400 grid grid-rows-4 items-center justify-center">
                            {/* Video Container */}
                            <motion.div layoutId="local-container" className="h-[500px] w-[500px] row-span-3">
                                <video key="local-video" id="localVideo" className="w-full h-full object-cover" autoPlay playsInline controls={false} ref={localVideoRef}></video>
                            </motion.div>
                            <motion.div layout="position" layoutId="waiting-conn" className="row-span-1 flex items-center justify-center">
                                Waiting for connection ...
                            </motion.div>
                        </div>
                    )}
                </motion.div>
                {/* Sidebar */}
                <motion.div layoutId="chat-component" className="max-h-full w-48 p-4 flex flex-col gap-4 text-3xl">
                    {/* Rotated Open Chat Button */}
                    <motion.button key="show-chat-btn" layout="position" layoutId="chat-state-btn" className="relative border-neutral-400 flex-6 group cursor-pointer" onClick={handleChatOpen}>
                        <div className="text-5xl rotate-270 flex items-center gap-4 text-nowrap justify-center">
                            <div>Open Chat</div>
                            <motion.div className="group-hover:rotate-90 transition-all duration-300"><Y2K_Diamond /></motion.div>
                        </div>
                        <motion.div layoutId="main-chat" className="absolute h-full top-0 overflow-hidden w-0 right-0">
                            MAIN CHAT
                        </motion.div>
                    </motion.button>
                    <motion.div layout="position" className="relative flex-3 flex flex-col gap-2" layoutId="btn-container">
                        <SidebarButton onClick={handleSkip} layoutId="skip-btn" label="Skip" />
                        <SidebarButton layoutId="pause-btn" label="Pause" />
                        <SidebarButton onClick={handleBack} layoutId="back-btn" label="Back" />
                    </motion.div>
                </motion.div>
            </>
        )}
        </AnimatePresence>
        </LayoutGroup>
        </main>

    )
}



function Y2K_Diamond(){
    return (
        <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width={60} viewBox="0 0 500 500"><path className="fill-neutral-100" d="M467.5,250C288.38,271.2,271.2,288.38,250,467.5,228.8,288.38,211.62,271.2,32.5,250,211.62,228.8,228.8,211.62,250,32.5,271.2,211.62,288.38,228.8,467.5,250Z"/></svg>
    )
}