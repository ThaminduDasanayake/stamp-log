import Link from "next/link";
import {CompassIcon, HouseIcon, MagnifyingGlassIcon} from "@phosphor-icons/react/dist/ssr";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";

export default function NotFound() {
    return (
        <div
            className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-8 font-sans selection:bg-indigo-500/20 selection:text-indigo-600">
            <div className="max-w-md w-full text-center space-y-6">

                {/* Brand Icon & Error Badge */}
                <div className="flex flex-col items-center gap-3">
                    <div
                        className="h-16 w-16 rounded-2xl bg-accent border border-indigo-500/20 flex items-center justify-center text-primary shadow-lg shadow-indigo-500/10 animate-bounce">
                        <CompassIcon className="h-8 w-8 text-primary" weight="duotone"/>
                    </div>
                    <Badge variant="destructive" className="font-mono text-xs px-3 py-1">
                        404 — Page Not Found
                    </Badge>
                </div>

                {/* Heading & Explanation */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                        Lost Signal in space
                    </h1>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        The release note, route, or changelog version you are looking for has either been moved,
                        unlisted, or does not exist.
                    </p>
                </div>

                {/* Code Snippet Box */}
                <div
                    className="p-3.5 rounded-xl bg-muted/60 border border-border/80 text-left font-mono text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center gap-1.5 text-destructive font-semibold">
                        <MagnifyingGlassIcon className="h-3.5 w-3.5" weight="bold"/>
                        <span>HTTP status: 404 NOT_FOUND</span>
                    </div>
                    <p className="text-[11px] opacity-80">
                        Target route signal was lost before reaching StampLog server.
                    </p>
                </div>

                {/* Navigation Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <Link href="/" className="w-full sm:w-auto">
                        <Button variant="default" className="w-full gap-2 shadow-md shadow-indigo-500/20">
                            <HouseIcon className="h-4 w-4" weight="bold"/> Return to Workbench
                        </Button>
                    </Link>
                </div>

                {/* Footer info */}
                <p className="text-[11px] text-muted-foreground pt-4 border-t border-border/60">
                    stamplog • Official AI release notes from raw git logs
                </p>

            </div>
        </div>
    );
}
