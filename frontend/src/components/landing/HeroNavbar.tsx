import MaskText from "../MaskTest"

export default function HeroNavbar(){

    const navbarLinks = [
        {
            number: "01",
            name: "How to"
        },
        {
            number: "02",
            name: "FAQ"
        },
        {
            number: "03",
            name: "Contact"
        }
    ]

    return (
        <nav className="h-auto p-4 px-[10%] flex justify-start gap-20 font-montreal text-lg font-thin">
            {navbarLinks.map(item => (
                <MaskText>
                    <div className="flex gap-2 items-end cursor-pointer">
                        <div>{item.number}</div>
                        <div className="text-2xl">{item.name}</div>
                    </div>
                </MaskText>
            ))}
        </nav>
    )
}