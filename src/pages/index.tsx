//NextJS
import Head from "next/head";
import { motion } from "framer-motion";

//HeroUI
import { Button } from "@heroui/react";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

import { Hero } from "../components/sections/Hero";
import { Evolution } from "../components/sections/Evolution";
import { Footer } from "../components/sections/Footer";
import { Presentation } from "@/components/sections/Presentation";

export default function Home() {
  return (
    <>
      <Head>
        <title>Vibly - Learn with people. Speak your world.</title>
        <meta name="description" content="Vibly is the future of language learning — social, immersive, and built around real conversations." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <main>
        <Hero />
        <Presentation />
        <Footer />
      </main>
    </>
  );
}
