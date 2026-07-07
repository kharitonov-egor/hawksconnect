"use client"

import NavBar from "./NavBar";
import Main from "./main"
import Footer from "./Footer"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-zinc-50 text-black">
        <NavBar useCase="landing"/>
        <Main/>
        <Footer/>
    </div>
  );
}