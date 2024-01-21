import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Montserrat } from "next/font/google";
import { Toaster } from "react-hot-toast";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <main className={`${montserrat.className}`}>
      <SessionProvider session={session} refetchInterval={5 * 60}>
        <Toaster />
        <Component {...pageProps} />
      </SessionProvider>
    </main>
  );
}
