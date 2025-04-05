import AboutSection from "../components/landing/AboutSection";
import Background from "../components/landing/Background";
import HeroSection from "../components/landing/HeroSection";

export default function Landing() {
    return (
        <div className="min-h-screen relative overflow-x-hidden">
            <Background />
            <div className="max-w-[2000px]">
                <HeroSection />
                <AboutSection />
            </div>
        </div>
    )
}
