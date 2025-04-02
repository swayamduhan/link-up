    import { useEffect, useRef, useState } from "react"
import SidebarButton from "./SidebarButton"
    import { motion } from "motion/react"
    export default function CallComponent({ localStreamRef, localVideoRef, remoteVideoRef, receivedVideo }: { localStreamRef: React.RefObject<MediaStream | null>, localVideoRef: React.RefObject<HTMLVideoElement | null>, remoteVideoRef: React.RefObject<HTMLVideoElement | null>, receivedVideo: boolean }) {
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

        return (
            <main className="flex flex-1">
            {chatOpen ? (
                <>
                Chat is open
                </>
            ) : (
                <>
                    {/* Main Call When Chat Closed */}
                    <div className="max-h-full flex-1 p-4 text-4xl">
                        {/* Wait for receivedVideo until then show a waiting and zoomed in local video */}
                        {receivedVideo ? (
                            // Received Video Container
                            // Remote video on full screen
                            // local video draggable on top of it
                            <div className="h-full w-full relative p-8">
                                <video key="remote-video" id="remoteVideo" className="absolute top-0 left-0 h-full w-full object-cover" autoPlay playsInline controls={false} ref={remoteVideoRef} />
                                
                                {/* drag constraint div for local video */}
                                <motion.div ref={constraintsRef} className="absolute inset-6 border border-neutral-400">
                                    {/* div to contain local video */}
                                    <motion.div drag dragConstraints={constraints} className="relative h-[250px] w-[400px]" style={{ boxShadow : "0px 0px 14px 2px rgb(0,0,0,0.3)"}}>
                                        <video key="local-video" id="localVideo" className="w-full h-full object-cover" autoPlay playsInline controls={false} ref={localVideoRef}></video>
                                    </motion.div>
                                </motion.div>
                            </div>
                        ) : (
                            <div className="h-full border border-neutral-400 grid grid-rows-4 items-center justify-center">
                                {/* Video Container */}
                                <div className="h-[500px] w-[500px] row-span-3">
                                    <video key="local-video" id="localVideo" className="w-full h-full object-cover" autoPlay playsInline controls={false} ref={localVideoRef}></video>
                                </div>
                                <div className="row-span-1 flex items-center justify-center">
                                    Waiting for connection ...
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Sidebar */}
                    <div className="max-h-full w-48 p-4 flex flex-col gap-4 text-3xl">
                        {/* Rotated Open Chat Button */}
                        <button className="border border-neutral-400 flex-1 group cursor-pointer">
                            <div className="text-5xl rotate-270 flex items-center gap-4 text-nowrap justify-center">
                                <div>Open Chat</div>
                                <motion.div className="group-hover:rotate-90 transition-all duration-300"><Y2K_Diamond /></motion.div>
                            </div>
                        </button>
                        <SidebarButton label="Skip" />
                        <SidebarButton label="Pause" />
                        <SidebarButton label="Back" />
                    </div>
                </>
            )}

            </main>

        )
    }



    function Y2K_Diamond(){
        return (
            <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width={60} viewBox="0 0 500 500"><path className="fill-neutral-100" d="M467.5,250C288.38,271.2,271.2,288.38,250,467.5,228.8,288.38,211.62,271.2,32.5,250,211.62,228.8,228.8,211.62,250,32.5,271.2,211.62,288.38,228.8,467.5,250Z"/></svg>
        )
    }