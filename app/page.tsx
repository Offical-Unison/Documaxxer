import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
    </>
  );
}