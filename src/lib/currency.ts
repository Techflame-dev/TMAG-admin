import type { Invoice, SystemSettings } from "../api/types";

export function getCurrencySymbol(currency: string | undefined): string {
    const c = (currency ?? "USD").toUpperCase();
    switch (c) {
        case "NGN":
            return "₦";
        case "EUR":
            return "€";
        case "GBP":
            return "£";
        default:
            return "$";
    }
}

/** Sum invoice amounts grouped by ISO currency code (uppercase). */
export function sumInvoicesByCurrency(invoices: Pick<Invoice, "amount" | "currency">[]): Map<string, number> {
    const m = new Map<string, number>();
    for (const inv of invoices) {
        const c = (inv.currency ?? "USD").toUpperCase();
        m.set(c, (m.get(c) ?? 0) + inv.amount);
    }
    return m;
}

/**
 * Match server AdminAnalyticsService: foreign amounts × rate = base. Missing rate → 0.
 */
export function convertInvoiceAmountToBase(
    amount: number,
    currency: string | undefined,
    settings: Pick<SystemSettings, "revenueBaseCurrency" | "exchangeRateNGN" | "exchangeRateEUR" | "exchangeRateGBP">,
): number {
    const base = (settings.revenueBaseCurrency ?? "USD").toUpperCase();
    const c = (currency ?? base).toUpperCase();
    if (c === base) return amount;
    const rates: Record<string, number | undefined> = {
        NGN: settings.exchangeRateNGN,
        EUR: settings.exchangeRateEUR,
        GBP: settings.exchangeRateGBP,
    };
    const rate = rates[c];
    if (rate == null || !Number.isFinite(rate)) return 0;
    return amount * rate;
}
