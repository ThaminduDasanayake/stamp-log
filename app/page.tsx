import Link from "next/link";
import {
  BroadcastIcon,
  SparkleIcon,
  PaletteIcon,
  GithubLogoIcon,
  LockIcon,
} from "@phosphor-icons/react/dist/ssr";
import { GeneratorStudio } from "@/components/generator-studio";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-md shadow-indigo-500/20">
            <BroadcastIcon className="h-5 w-5" weight="bold" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">stamplog</h1>
            <p className="text-[11px] text-muted-foreground">
              Official AI release notes from raw git logs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/projects/import">
            <Badge
              variant="outline"
              className="px-3 py-1.5 text-xs gap-1.5 border-indigo-500/30 hover:bg-muted transition-colors cursor-pointer"
            >
              <GithubLogoIcon className="h-3.5 w-3.5 text-primary" weight="bold" />
              Import Repo
            </Badge>
          </Link>
          <Link href="/design-system">
            <Badge
              variant="outline"
              className="px-3 py-1.5 text-xs gap-1.5 hover:bg-muted transition-colors cursor-pointer"
            >
              <PaletteIcon className="h-3.5 w-3.5 text-primary" weight="bold" />
              Design System
            </Badge>
          </Link>
          <Link href="/login">
            <Badge
              variant="dev"
              className="px-3 py-1.5 text-xs gap-1.5 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <LockIcon className="h-3.5 w-3.5" weight="bold" />
              Sign In
            </Badge>
          </Link>
        </div>
      </header>

      {/* Main Studio Workbench */}
      <div className="flex-1 py-6">
        <GeneratorStudio />
      </div>
    </main>
  );
}
