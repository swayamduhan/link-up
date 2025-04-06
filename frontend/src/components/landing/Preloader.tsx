import { AnimatePresence, motion, Variants } from "motion/react"
import { useEffect, useState } from "react"

export default function Preloader(){
    const [loaded, setLoaded] = useState(false)

    const parentVariants : Variants = {
        "open" : {},
        "exit" : {}
    }

    const gridVariants : Variants = {
        "open" : {
            translateX : "0%",
            transition : {
                duration: 0.5,
                ease: [0.99,0.12,0.72,0.93]
            }
        },
        "exit" : {
            translateX: "100%",
            transition: {
                duration: 0.5,
                ease: [0.99,0.12,0.72,0.93]
            }
        }
    }

    const textVariants : Variants = {
        "open" : {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            transition: {
                duration: 0.3
            }
        },
        "exit" : {
            y: -20,
            opacity: 0,
            filter: "blur(10px)",
            transition: {
                duration: 0.3
            }
        }
    }

    useEffect(() => {
        const loadDone = () => setLoaded(true)
        if(document.readyState === "complete"){
            loadDone
        } else {
            window.addEventListener("load", loadDone)
        }

        return () => window.removeEventListener("load", loadDone)
    }, [])


    return (

        <>
        <AnimatePresence mode="wait">
        {!loaded && 
            <motion.div className="fixed isolate inset-0 z-[20] text-neutral-100 grid grid-cols-20" variants={parentVariants} initial="open" exit="exit">
                {/* text at center */}
                <motion.div key="preloader-text" className="absolute z-[30] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-6xl font-thin italic" variants={textVariants}>Loading Linkup...</motion.div>
                {Array.from({ length: 20 }).map((x, index) => (
                    <div key={index} className="w-full h-full overflow-x-hidden border border-neutral-400/30">
                        <motion.div variants={gridVariants} className="h-full bg-neutral-900 relative"></motion.div>
                    </div>
                ))}
            </motion.div>
        }
        </AnimatePresence>
        </>
    )
}