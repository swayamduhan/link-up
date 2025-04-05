import SpectralGradient from "../../assets/spectral-gradient.jpg"

export default function Background(){
    return (
        <div className="fixed inset-0 z-[-10] overflow-hidden pointer-events-none opacity-50">
            <img src={SpectralGradient} className="object-cover w-full h-full"/>
        </div>
    )
}