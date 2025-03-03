import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-purple-100 via-purple-200 to-purple-100 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 pt-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          Talk Freely,
          <br />
          AI Listens Anytime
        </h1>
        <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
        Need a place to vent without judgment? Our AI is here to listen, anytime, anywhere. Share your thoughts safely and comfortably—no limits, no worries.
        </p>
        <div className="mt-10">
          <Button size="lg" variant={"default"} className="rounded-full px-8 py-3 text-base font-medium shadow-2xl bg-white">
            <Link href={"/dashboard"}>
              Get Started
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
