import MaskText from "../MaskText"

interface NavLinkInterface {
    number: string,
    name: string,
    onclick: () => void
}

export default function HeroNavbar(){

    function scrollToAbout(){
        const aboutSection = document.getElementById("about")
        aboutSection?.scrollIntoView({ behavior: "smooth" })
    }

    const navbarLinks : NavLinkInterface[] = [
        {
            number: "01",
            name: "About",
            onclick: scrollToAbout
        },
        {
            number: "02",
            name: "FAQ",
            onclick: () => {}
        },
        {
            number: "03",
            name: "Contact",
            onclick: () => {}
        }
    ]

    return (
        <nav className="h-auto p-4 px-[10%] flex justify-start gap-20 font-montreal text-lg font-thin relative z-[18] backdrop-blur-sm">
            {navbarLinks.map(item => (
                <MaskText>
                    <button className="flex gap-2 items-end cursor-pointer" onClick={item.onclick}>
                        <div>{item.number}</div>
                        <div className="text-2xl">{item.name}</div>
                    </button>
                </MaskText>
            ))}
        </nav>
    )
}