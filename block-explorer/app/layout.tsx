import Container from '@/components/container';
import QueryProvider from '@/components/layouts/query-provider';
import MainSearch from '@/components/main-search';
import SiteFooter from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { TailwindIndicator } from '@/components/tailwind-indicator';
import { ThemeProvider } from '@/components/theme-provider';
import { fontLocal } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';
import { Metadata, Viewport } from 'next';
import dynamic from 'next/dynamic';
import Script from 'next/script';

const ClientProgressBar = dynamic(() => import('../components/client-progressbar'), {
  ssr: false,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://rootscan.io/'),
  title: {
    default: `Rootscan — The Root Network Blockchain Explorer`,
    template: `%s • Rootscan`,
  },
  description: `Rootscan allows you to explore and search The Root Network blockchain for transactions, addresses and futurepasses, tokens, prices, and more.`,
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    images: 'https://rootscan.io/og-image.png',
    url: 'https://rootscan.io',
    siteName: 'Rootscan',
    title: 'Rootscan — The Root Network Blockchain Explorer',
    description:
      'Rootscan allows you to explore and search The Root Network blockchain for transactions, addresses and futurepasses, tokens, prices, and more.',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rootscan — The Root Network Blockchain Explorer',
    description:
      'Rootscan allows you to explore and search The Root Network blockchain for transactions, addresses and futurepasses, tokens, prices, and more.',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={cn(['min-h-screen bg-[#ebebebeb] antialiased dark:bg-white/5', fontLocal.variable, 'font-local'])}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          <QueryProvider>
            <div className="relative flex min-h-screen flex-col justify-between">
              <SiteHeader />
              <Container className="lg:hidden">
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
      {process?.env?.PLAUSIBLE_DATA_DOMAIN && (
        <Script
          defer
          data-domain={process.env.PLAUSIBLE_DATA_DOMAIN}
          src="https://plausible.rootscan.io/js/script.js"
          strategy="afterInteractive"
        />
      )}
    </html>
  );
}
