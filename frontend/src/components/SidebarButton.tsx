export default function SidebarButton({ label, onClick }: { label: string, onClick?: () => void }) {
    return (
        <button className="h-20 bg-white text-black hover:bg-neutral-900 hover:text-neutral-100 transition-all cursor-pointer" onClick={onClick}>{label}</button>
    )
}
