import { motion } from "motion/react"
import React from "react"

export default function StackedPop({ title, children }: {title: string, children: React.ReactNode }){
    return (
        <motion.div className="border px-10 py-4 relative">
            <div className="text-3xl">{title}</div>
            <div className="absolute top-10">{children}</div>
        </motion.div>
    )
}