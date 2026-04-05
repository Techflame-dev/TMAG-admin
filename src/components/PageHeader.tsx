import type { ReactNode } from "react";
import { cn } from "../lib/utils";

type PageHeaderProps = {
    title: string;
    description?: string;
    badge?: ReactNode;
    actions?: ReactNode;
    className?: string;
};

/**
 * Matches client `DashboardHeader` title scale and spacing for admin list/detail pages.
 */
export default function PageHeader({
    title,
    description,
    badge,
    actions,
    className,
}: PageHeaderProps) {
    return (
        <div
            className={cn(
                "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8",
                className,
            )}
        >
            <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-serif text-heading">
                        {title}
                    </h1>
                    {badge}
                </div>
                {description ?
                    <p className="text-sm text-muted mt-1 max-w-2xl">{description}</p>
                :   null}
            </div>
            {actions ?
                <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>
            :   null}
        </div>
    );
}
