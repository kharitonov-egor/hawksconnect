"use client"

import NavBar from "./NavBar";
import Main from "./main"
import Footer from "./Footer"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#06357A] text-black">
        <NavBar useCase="landing"/>
        <Main/>
        <Footer/>
    </div>
  );
}