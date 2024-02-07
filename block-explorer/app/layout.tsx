import Container from "@/components/container"
import QueryProvider from "@/components/layouts/query-provider"
import MainSearch from "@/components/main-search"
import SiteFooter from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"
import { fontLocal } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import "@/styles/globals.css"
import { Metadata, Viewport } from "next"
import dynamic from "next/dynamic"
const ClientProgressBar = dynamic(
  () => import("../components/client-progressbar"),
  {
    ssr: false,
  }
)

export const metadata: Metadata = {
  title: {
    default: `Rootscan`,
    template: `%s • Rootscan`,
  },
  description: `Rootscan is a Block Explorer tailored for The Root Network, an innovative decentralized network.`,
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
    <html lang="en">
      <body
        className={cn([
          "min-h-screen bg-[#ebebebeb] antialiased dark:bg-white/5",
          fontLocal.variable,
          "font-local",
        ])}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          <QueryProvider>
            {/* Background mounter */}
            {/* <div className="fixed h-screen w-screen bg-cover bg-main-image blur-[50px] invert dark:invert-0" /> */}
            <div className="relative flex min-h-screen flex-col justify-between">
              <SiteHeader />
              <Container className="md:hidden">
                <MainSearch />
              </Container>
              {children}
              <SiteFooter />
            </div>
            <TailwindIndicator />
            <ClientProgressBar />
          </QueryProvider>
        </ThemeProvider>
      </body>
      {/* <RefreshProvider /> */}
    </html>
  )
}
