import "@/styles/globals.css"
import { Metadata, Viewport } from "next"

import ClientProgressBar from "@/components/client-progressbar"
import Container from "@/components/container"
import QueryProvider from "@/components/layouts/query-provider"
import MainSearch from "@/components/main-search"
import SiteFooter from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { fontLocal } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: {
    default: `Rootscan`,
    template: `%s - Rootscan`,
  },
  description: `Rootscan is a Block Explorer for The Root Network`,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className="dark"
      style={{
        colorScheme: "dark",
      }}
    >
      <body
        className={cn([
          "min-h-screen bg-[#ebebebeb] font-local antialiased transition-all duration-100 ease-in-out dark:bg-white/5",
          fontLocal.variable,
          "font-local",
        ])}
      >
        <QueryProvider>
          {/* Background mounter */}
          {/* <div className="fixed h-screen w-screen bg-cover bg-main-image blur-[50px] invert dark:invert-0" /> */}
          <ThemeProvider attribute="class" defaultTheme="dark">
          <div className="relative flex min-h-screen flex-col justify-between">
            <SiteHeader />
            <Container className="md:hidden">
              <MainSearch />
            </Container>
            {children}
            <SiteFooter />
          </div>
          <TailwindIndicator />
          </ThemeProvider>
          <ClientProgressBar />
        </QueryProvider>
      </body>
      {/* <RefreshProvider /> */}
    </html>
  )
}
