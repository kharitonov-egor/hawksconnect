"use client"

import { useParams } from "next/navigation"

export default function Event() {
    const params = useParams()
    const test = params.id as string
    return (
        <>
            <h2>{test}</h2>
        </>
    )
}