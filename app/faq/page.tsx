"use client"

import { HelpCircle } from "lucide-react"
import faqData from "./faqData"
import NavBar from "../NavBar"

export default function FAQ() {
    return (
        <div className="flex flex-col min-h-screen w-full bg-zinc-50 text-black">
            <NavBar useCase="faq"/>
            <div className="flex justify-center p-3 pb-20 md:p-0">
                <div className="flex flex-col w-full max-w-[1200px] mt-15 px-4 md:px-0">
                    
                    <div className="flex flex-row gap-1 items-center mb-6 md:mb-10">
                        <HelpCircle color="#06357A" size={30} className="md:w-[35px] md:h-[35px]"/>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold">Frequently Asked Questions</h1>
                    </div>
                    
                    <div className="flex flex-col gap-6">
                        {faqData.map((faq, index) => (
                            <div key={index}>
                                <h3 className="text-xl font-semibold mb-2">
                                    {faq.question}
                                </h3>
                                <p 
                                    className="text-gray-600 [&_a]:text-[#06357A] [&_a]:font-semibold [&_a]:hover:text-blue-800"
                                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                                />
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    )
}