import { Link } from "react-router-dom"

export default function Footer(){
    return (
        <footer className="font-montreal p-6 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-4 text-3xl">
                <div>We are open source!</div>
                <a
                href="https://github.com/swayamduhan/link-up"
                target="_blank"
                rel="noopener noreferrer"
                className="border-b hover:border-b-2 transition-all duration-200"
                >
                    <div className="border-b hover:border-b-2 transition-all duration-200">click me</div>
                </a>
            </div>
            <div className="flex justify-end">
                <div>// LinkUp, 2025</div>
            </div>
        </footer>
    )
}