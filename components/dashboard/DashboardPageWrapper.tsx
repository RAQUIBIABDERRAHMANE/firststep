/**
 * Shared padding wrapper used by all non-restaurant dashboard pages.
 * The root layout.tsx no longer applies padding (so restaurant sub-pages
 * can render a full-width tab bar without negative-margin hacks).
 */
export default function DashboardPageWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {children}
        </div>
    )
}
