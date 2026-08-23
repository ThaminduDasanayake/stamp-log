import Link from "next/link";
import {
  BroadcastIcon,
  SparkleIcon,
  PaletteIcon,
  GithubLogoIcon,
  GlobeIcon,
  LockIcon,
} from "@phosphor-icons/react/dist/ssr";
import { GeneratorStudio } from "@/components/generator-studio";
import { Badge } from "@/components/ui/badge";

export default function StampLogAppPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Top Application Navigation */}
      <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-md shadow-indigo-500/20">
              <BroadcastIcon className="h-4.5 w-4.5" weight="bold" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">stamplog</h1>
              <p className="text-[10px] text-muted-foreground leading-none">Studio App</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/projects/import">
            <Badge
              variant="outline"
              className="px-3 py-1 text-xs gap-1.5 border-indigo-500/30 hover:bg-muted transition-colors cursor-pointer"
            >
              <GithubLogoIcon className="h-3.5 w-3.5 text-primary" weight="bold" />
              Import Repo
            </Badge>
          </Link>
          <Link href="/p/demo">
            <Badge
              variant="outline"
              className="px-3 py-1 text-xs gap-1.5 hover:bg-muted transition-colors cursor-pointer"
            >
              <GlobeIcon className="h-3.5 w-3.5 text-emerald-500" weight="bold" />
              Public History
            </Badge>
          </Link>
          <Link href="/design-system">
            <Badge
              variant="outline"
              className="px-3 py-1 text-xs gap-1.5 hover:bg-muted transition-colors cursor-pointer"
            >
              <PaletteIcon className="h-3.5 w-3.5 text-primary" weight="bold" />
              Design System
            </Badge>
          </Link>
          <Badge variant="dev" className="px-3 py-1 text-xs gap-1.5">
            <SparkleIcon className="h-3.5 w-3.5" weight="fill" />
            Gemini 3.6 Flash
          </Badge>
        </div>
      </header>

      {/* Generator Studio Workbench */}
      <div className="flex-1 py-4">
        <GeneratorStudio />
      </div>
    </main>
  );
}
