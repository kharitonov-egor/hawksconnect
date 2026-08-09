interface CalendarEventInfo {
    title: string
    description?: string
    location?: string
    startTime: string
    endTime?: string
}

// Converts an ISO date string to the UTC format calendar links/ICS files expect: YYYYMMDDTHHMMSSZ
function toICSDate(dateStr: string): string {
    return new Date(dateStr).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
}

function getEndTime(event: CalendarEventInfo): string {
    if (event.endTime) return event.endTime
    // Fallback: default to 1 hour after start if no end time is set
    const start = new Date(event.startTime)
    return new Date(start.getTime() + 60 * 60 * 1000).toISOString()
}

export function buildGoogleCalendarUrl(event: CalendarEventInfo): string {
    const params = new URLSearchParams({
        action: "TEMPLATE",
        text: event.title,
        dates: `${toICSDate(event.startTime)}/${toICSDate(getEndTime(event))}`,
        details: event.description || "",
        location: event.location || "",
    })
    return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function buildOutlookUrl(event: CalendarEventInfo): string {
    const params = new URLSearchParams({
        path: "/calendar/action/compose",
        rru: "addevent",
        subject: event.title,
        startdt: new Date(event.startTime).toISOString(),
        enddt: new Date(getEndTime(event)).toISOString(),
        location: event.location || "",
        body: event.description || "",
    })
    return `https://outlook.office.com/calendar/0/deeplink/compose?${params.toString()}`
}

export function buildICSContent(event: CalendarEventInfo): string {
    const escapeText = (text: string) => text.replace(/[,;]/g, (m) => `\\${m}`).replace(/\n/g, "\\n")

    return [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//HawksConnect//Event//EN",
        "BEGIN:VEVENT",
        `UID:${Date.now()}@hawksconnect`,
        `DTSTAMP:${toICSDate(new Date().toISOString())}`,
        `DTSTART:${toICSDate(event.startTime)}`,
        `DTEND:${toICSDate(getEndTime(event))}`,
        `SUMMARY:${escapeText(event.title)}`,
        event.description ? `DESCRIPTION:${escapeText(event.description)}` : "",
        event.location ? `LOCATION:${escapeText(event.location)}` : "",
        "END:VEVENT",
        "END:VCALENDAR",
    ].filter(Boolean).join("\r\n")
}

export function downloadICS(event: CalendarEventInfo) {
    const content = buildICSContent(event)
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${event.title.replace(/[^a-z0-9]/gi, "_")}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}