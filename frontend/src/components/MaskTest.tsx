export default function MaskText({ children }: { children: React.ReactNode}){
    return (
        <div className="group overflow-hidden relative">
            <div className="w-full absolute top-[-100%] group-hover:top-[0%] transition-all duration-300">{children}</div>
            <div className="relative top-[0%] group-hover:top-[100%] transition-all duration-300">
                {children}
            </div>
        </div>
    )
}