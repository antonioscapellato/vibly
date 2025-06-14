import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Poppins } from 'next/font/google';
import {HeroUIProvider} from '@heroui/react'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${poppins.variable} font-sans`}>
      <HeroUIProvider>
        <Component {...pageProps} />
      </HeroUIProvider>
    </main>
  );
}
