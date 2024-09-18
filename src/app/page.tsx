"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function Dashboard() {
  return (
    <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <Button
          onClick={() => {
            toast({ title: "AA" });
          }}
        >
          Button
        </Button>
      </main>
    </div>
  );
}
