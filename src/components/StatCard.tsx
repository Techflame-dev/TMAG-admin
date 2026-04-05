import type { ReactNode } from "react";
import { cn } from "../lib/utils";

export interface StatCardProps {
    label: string;
    value: string | number | ReactNode;
    icon?: ReactNode;
    /** Secondary line under the value (client dashboard calls this `detail`) */
    detail?: string | ReactNode;
    /** Use accent styling for the icon container */
    accent?: boolean;
    /** Override icon wrapper classes (e.g. `bg-gold/10 text-gold`) */
    iconClassName?: string;
}

/**
 * Matches `client/src/components/dashboard/StatCard.tsx` for visual parity.
 */
export default function StatCard({
    label,
    value,
    icon,
    detail,
    accent,
    iconClassName,
}: StatCardProps) {
    const iconBox =
        iconClassName ??
        (accent ? "bg-accent/10 text-accent" : "bg-button-secondary text-heading");
    return (
        <div className="bg-white rounded-2xl p-4 sm:p-6 flex flex-col gap-3 border border-border-light/50">
            <div className="flex items-center justify-between gap-2">
                <span className="text-xs uppercase tracking-wider text-muted font-semibold">
                    {label}
                </span>
                {icon ?
                    <div
                        className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                            iconBox,
                        )}
                    >
                        {icon}
                    </div>
                :   null}
            </div>
            <span className="text-2xl sm:text-3xl font-serif text-heading tabular-nums">
                {value}
            </span>
            {detail ? <div className="text-xs text-muted">{detail}</div> : null}
        </div>
    );
}
