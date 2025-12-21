"use client"

import NavBar from "./NavBar";
import Main from "./main"
export default function Home() {
  return (
    <div className="flex flex-col h-full w-full bg-zinc-50 text-black">
        <NavBar/>
        <Main/>
    </div>
  );
}
