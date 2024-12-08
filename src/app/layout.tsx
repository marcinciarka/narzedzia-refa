import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.scss";
import { Sidebar } from "@/components/Sidebar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Narzędzia Referendarza",
  description: "Narzędzia Referendarza",
};

const style = {
  container: "h-screen overflow-hidden relative",
  mainContainer: "flex flex-col h-screen pl-0 w-full lg:w-[calc(100%-16rem)]",
  main: "h-screen overflow-auto pb-36 pt-4 px-2 md:pb-8 md:px-4 lg:px-6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className={style.container}>
          <div className="flex items-start">
            <Sidebar mobileOrientation="end" />
            <div className={style.mainContainer}>
              <main className={style.main}>{children}</main>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
