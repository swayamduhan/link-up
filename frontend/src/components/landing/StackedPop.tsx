import { motion, Variants } from "motion/react"

export default function StackedPop({ title }: { title: string }){
    const childVariants : Variants = {
        "out" : {
            opacity: 0,
            y: 20,
            filter: "blur(10px)",
            paddingLeft: "0px",
            color: "oklch(80% 0 0)",
            transition: {
                duration: 0.3
            }
        },
        "in" :{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            paddingLeft: "0px",
            color: "oklch(80% 0 0)",
            transition: {
                duration: 0.3
            }
        }
    }
    return (
        <motion.div  variants={childVariants} className="border-b h-20 relative font-montreal" whileHover={{ paddingLeft: "10px", color: "oklch(98.5% 0 0)"}}>
            <motion.div className="text-3xl h-full flex items-center px-10">
                {title}
            </motion.div>
        </motion.div>
    )
}