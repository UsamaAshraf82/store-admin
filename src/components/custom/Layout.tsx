import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BookCopy,
  Home,
  Package,
  PanelLeft,
  Settings,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";

const topmenu = [
  {
    link: "/hero",
    icon: <Home className="h-5 w-5" />,
    title: "Hero",
  },

  {
    link: "/category",
    icon: <BookCopy className="h-5 w-5" />,
    title: "Category",
  },

  {
    link: "/products",
    icon: <Package className="h-5 w-5" />,
    title: "Products",
  },
  {
    link: "/orders",
    icon: <ShoppingCart className="h-5 w-5" />,
    title: "Orders",
  },
];
const bottommenu = [
  {
    link: "/settings",
    icon: <Settings className="h-5 w-5" />,
    title: "Settings",
  },
];

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-neutral-800/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col sm:flex bg-neutral-950">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
          {/* <Link
            href="#"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-neutral-900 text-lg font-semibold text-neutral-50 md:h-8 md:w-8 md:text-base dark:bg-neutral-50 dark:text-neutral-900"
          ></Link> */}
          {topmenu.map((i) => (
            <Tooltip key={i.title}>
              <TooltipTrigger asChild>
                <Link
                  href={i.link}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:text-neutral-950 md:h-8 md:w-8 dark:text-neutral-400 dark:hover:text-neutral-50"
                >
                  {i.icon}
                  <span className="sr-only">{i.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{i.title}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
          {bottommenu.map((i) => (
            <Tooltip key={i.title}>
              <TooltipTrigger asChild>
                <Link
                  href={i.link}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:text-neutral-950 md:h-8 md:w-8 dark:text-neutral-400 dark:hover:text-neutral-50"
                >
                  {i.icon}
                  <span className="sr-only">{i.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{i.title}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
      </aside>
      <div className="flex flex-col ">
        <header className="sticky w-dvw  md:hidden top-0 z-30 flex  bg-transparent">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="sm:hidden absolute right-3 top-3"
              >
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                {topmenu.map((i) => (
                  <Link
                    key={i.title}
                    href={i.link}
                    className="flex items-center gap-4 px-2.5 text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-50"
                  >
                    {i.icon}
                    {i.title}
                  </Link>
                ))}
                {bottommenu.map((i) => (
                  <Link
                    key={i.title}
                    href={i.link}
                    className="flex items-center gap-4 px-2.5 text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-50"
                  >
                    {i.icon}
                    {i.title}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </header>
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          {children}
        </div>
      </div>
    </div>
  );
}
