import StackedPop from "./StackedPop";
import { motion, Variants } from "motion/react"

// contains 
export default function AboutSection(){

    const upcomingFeatures = [
        "Screen sharing",
        "Live reactions",
        "Interest based matching",
        "Turn off/on video and audio mid-call",
    ]

    const parentVariants: Variants = {
        "out" : {
            transition : {
                staggerChildren: 0.2
            }
        },
        "in" : {
            transition : {
                staggerChildren: 0.2
            }
        }
    }

    return (
        <section id="about" className="mt-20 space-y-20">
            <div className="text-[2.5rem] text-center">Upcoming Features</div>

            {/* Stacked Pops container */}
            <motion.div className="px-20 mb-40" variants={parentVariants} initial="out" whileInView="in" viewport={{ once: true, amount: 0.2}}>
                {upcomingFeatures.map((feature, idx) => (
                    <StackedPop title={feature} key={idx}/>
                ))}
            </motion.div>
        </section>
    )
}