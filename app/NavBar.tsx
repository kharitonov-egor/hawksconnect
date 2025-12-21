import Image from "next/image"
import CTAButton from "./CTAButton"
import Link from "next/link"

export default function NavBar() {
    return (
        <div className="w-full flex items-center justify-center h-[75px]">
        <div className="w-[1200px] h-full flex flex-row justify-between items-center p-4 bg-gray-200 mt-5 rounded-md">
          <div>
            <Link href="/">
              <Image src='/icon.png' alt="HawksConnect Logo" width={50} height={50}/>
            </Link>
          </div>

          <div className="flex flex-row gap-5 items-center">

            <Link href="/contact">
              <h2 className="font-medium">Contact</h2>
            </Link>
            <div>
            <CTAButton/>
            </div>

          </div>
        </div>
      </div>
    )
}