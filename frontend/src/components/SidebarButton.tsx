import { motion } from "motion/react"

export default function SidebarButton({ label, onClick, layoutId }: { label: string, onClick?: () => void, layoutId: string }) {
    return (
        <motion.button layout="position" className="relative h-14 xl:h-20 flex-1 bg-white min-w-[100px] text-black hover:bg-neutral-900 hover:text-neutral-100 transition-all cursor-pointer text-2xl xl:text-3xl" onClick={onClick} layoutId={layoutId}>
            {label}
        </motion.button>
    )
}
