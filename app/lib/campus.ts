const campusDisplayNames: Record<string, string> = {
    dalemabry: "Dale Mabry Campus",
    plantcity: "Plant City Campus",
    brandon: "Brandon Campus",
    southshore: "SouthShore Campus",
    ybor: "Ybor City Campus",
    westshore: "Westshore Campus",
    hawkslanding: "Hawks Landing",
    hawsklanding: "Hawks Landing",
}

// Campus keys are inconsistent across the data (dale_mabry / dalemabry,
// south_shore / southshore), so match on letters only.
export function campusLabel(campus?: string | null): string {
    if (!campus) return ""
    return campusDisplayNames[campus.toLowerCase().replace(/[^a-z]/g, "")] ?? campus
}
