import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FBFBFA] dark:bg-[#050505]">
      <h2 className="text-4xl font-bold text-[#111111] dark:text-[#EAEAEA]">404</h2>
      <p className="mt-4 text-[#787774] dark:text-[#A0A0A0]">Page not found.</p>
      <div className="mt-8">
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}
