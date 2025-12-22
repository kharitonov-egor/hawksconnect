interface bothTimesProps {
    startTime: string;
    endTime: string
}

export default function BothTimes({startTime, endTime}: bothTimesProps) {
    return (
        <div className="flex flex-col">
            <h2>{startTime} - {endTime}</h2>
        </div>
    )
}