"use client"

import NavBar from "../NavBar"

export default function FAQ() {
    return (
        <div className="flex flex-col min-h-screen w-full bg-zinc-50 text-black">
            <NavBar useCase="faq"/>
            <div className="flex justify-center items-center mt-15">

                <h2>FAQ page</h2>

            </div>
        </div>
    )
}