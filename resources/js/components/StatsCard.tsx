


export default function StatsCard({
    title,
    value,
    icon,
    bgColor,
    iconColor,
}) {
    return (
        <div className="flex h-fit shadow-md flex-row w-4/6 items-center justify-between rounded-xl border p-4">
            <div className="flex flex-col gap-4">
                <p className="text-gray-500">{title}</p>
                <span className="text-5xl text-gray-600">{value}</span>
            </div>
            <div className={`rounded-full border ${bgColor} p-4`}>
                <span className={`${iconColor}`}>
                    {icon}
                </span>
            </div>
        </div>
    );
}
