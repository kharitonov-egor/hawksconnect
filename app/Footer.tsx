import Image from "next/image"
import Link from "next/link"

export default function Footer() {
    return (
        <footer className="w-full flex justify-center border-t border-gray-200 bg-white">
            <div className="w-full max-w-[1200px] px-4 md:px-0 py-10 flex flex-col gap-8">

                <div className="flex flex-col md:flex-row justify-between gap-8">
                    <div className="flex flex-col gap-3">
                        <Link href="/" className="flex items-center gap-2 w-fit transition-transform duration-150 hover:scale-105">
                            <Image src="/icon.png" alt="HawksConnect" width={32} height={32} className="rounded-md"/>
                            <span className="font-[family-name:var(--font-display)] font-semibold text-[#06357A]">HawksConnect</span>
                        </Link>
                        <p className="text-sm text-gray-500">
                            A hub for events across all Hillsborough College campuses. 
                        </p>
                    </div>

                    <div className="flex flex-row gap-12">
                        <div className="flex flex-col gap-2">
                            <h3 className="text-sm font-semibold text-[#06357A]">Explore</h3>
                            <Link href="/events" className="text-sm text-gray-500 hover:text-[#06357A] transition-all duration-150 hover:scale-105 w-fit inline-block">Events</Link>
                            <Link href="/faq" className="text-sm text-gray-500 hover:text-[#06357A] transition-all duration-150 hover:scale-105 w-fit inline-block">FAQ</Link>
                        </div>


                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pt-6 border-t border-gray-100">
                    <p className="text-xs text-gray-400">
                        © {new Date().getFullYear()} HawksConnect
                    </p>
                </div>

            </div>
        </footer>
    )
}