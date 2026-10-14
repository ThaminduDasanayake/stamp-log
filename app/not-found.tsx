import Link from "next/link";
import { HouseIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#000000] text-[#171717] dark:text-[#ededed] flex flex-col items-center justify-center p-4 sm:p-6 font-sans selection:bg-[#171717] selection:text-white dark:selection:bg-white dark:selection:text-[#171717]">
      <div className="max-w-sm w-full text-center space-y-5">
        <div className="flex flex-col items-center gap-2">
          <Badge variant="pixel" className="text-[11px] px-2.5 py-1">
            404 NOT_FOUND
          </Badge>
          <h1 className="text-2xl font-medium tracking-tight text-[#171717] dark:text-white mt-2">
            This page could not be found.
          </h1>
          <p className="text-xs text-[#666666] dark:text-[#888888] leading-relaxed">
            The release note, route, or changelog version does not exist.
          </p>
        </div>

        <div className="pt-2">
          <Link href="/">
            <Button
              variant="default"
              size="sm"
              className="h-9 px-4 gap-2 text-xs font-medium"
            >
              <HouseIcon className="h-3.5 w-3.5" weight="bold" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
