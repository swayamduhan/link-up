import Mockup from "../../assets/final_mockup.png"
import StarDoodle from "../../assets/star-doodle.png"
import GhostDoodle from "../../assets/ghost_doodle.png"
import ExcalamationDoodle from "../../assets/exc_doodle.png"
import BalloonDoodle from "../../assets/balloon_doodle.png"
import HeroNavbar from "./HeroNavbar"
import { motion } from "motion/react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function HeroSection(){
    const navigate = useNavigate()
    return (
        <section className="h-screen relative">
            {/* Navbar */}
            <HeroNavbar />

            {/* glass morphic container */}
            <motion.div className="h-auto max-h-[90vh] w-[80%] rounded-sm p-2 bg-white/20 absolute translate-x-[50%] top-[50%] translate-y-[-50%] shadow-[0px_0px_100px_5px_#ffffff40] preserve-3d perspective-[1000px]" initial={{y: 20, opacity: 0, filter: "blur(10px)", rotateX: "10deg", rotateY: "-20deg", rotateZ: "2deg"}} animate={{y:0, opacity: 1, filter: "blur(0px)"}} transition={{ delay: 1.2, duration: 0.3}}>
                <img src={Mockup} alt="Mockup image" className="rounded-sm object-cover w-full h-auto"/>
            </motion.div>

            {/* TEXT CONTENT */}
            <div className="absolute top-[50%] translate-y-[-50%] left-[10%] space-y-2">
                <motion.h1 className="text-6xl font-thin tracking-[-2px] relative" initial={{y: 20, opacity: 0, filter: "blur(10px)"}} animate={{y:0, opacity: 1, filter: "blur(0px)"}} transition={{ delay: 0.8, duration: 0.3}}>
                    <span className="italic">L</span>
                    <span>ink</span>
                    <span className="italic">U</span>
                    <span>p</span>
                </motion.h1>
                <motion.p className="font-montreal font-thin text-xl max-w-[300px] relative" initial={{y: 20, opacity: 0, filter: "blur(10px)"}} animate={{y:0, opacity: 1, filter: "blur(0px)"}} transition={{ delay: 0.9, duration: 0.3}}>
                    Because sometimes the best convos are with the people you never meet again :)
                </motion.p>
                <motion.button onClick={() => navigate("/call")} className="text-lg border bg-neutral-100 text-neutral-900 px-4 py-2 font-montreal mt-10 tracking-[3px] cursor-pointer group flex items-center relative" initial={{y: 20, opacity: 0, filter: "blur(10px)"}} animate={{y:0, opacity: 1, filter: "blur(0px)"}} transition={{ delay: 1, duration: 0.3}}>
                    <div className="inline-block">Fire up a convo</div>
                    <motion.div className={`inline-block w-0 group-hover:w-8 overflow-hidden rotate-[-180deg] group-hover:rotate-[0deg] duration-300 scale-0 group-hover:scale-100 transition-all`} >
                        <Arrow />
                    </motion.div>
                </motion.button>

                {/* Doodles here */}
                <img src={StarDoodle} alt="Star Doodle" width={50} className="absolute top-[-40%] left-[-20%]"/>
                <img src={StarDoodle} alt="Star Doodle" width={50} className="absolute bottom-[-60%] right-[-10%]"/>
                <img src={GhostDoodle} alt="Star Doodle" width={70} className="absolute top-[-70%] left-[60%]"/>
                <img src={ExcalamationDoodle} alt="Star Doodle" width={50} className="absolute bottom-[30%] right-[-30%]"/>
                <img src={BalloonDoodle} alt="Star Doodle" width={50} className="absolute bottom-[-50%] left-[-10%]"/>
            </div>
            <div className="font-montreal text-neutral-400 absolute bottom-2 left-[50%] translate-x-[-50%]">Scroll to know more</div>
        </section>
    )
}


function Arrow(){
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide ml-2 inline lucide-arrow-right-icon lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
    )
}