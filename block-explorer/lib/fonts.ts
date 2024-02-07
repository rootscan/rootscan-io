import localFont from "next/font/local"

export const fontLocal = localFont({
  src: [
    {
      path: "../public/fonts/ObjektivMk1-Medium.woff2",
      weight: "400",
    },
    {
      path: "../public/fonts/ObjektivMk1-Medium.woff2",
      weight: "500",
    },
    {
      path: "../public/fonts/ObjektivMk1_Trial_SBd.ttf",
      weight: "600",
    },
    {
      path: "../public/fonts/ObjektivMk1-Bold.woff2",
      weight: "700",
    },
  ],
  variable: "--font-local",
  preload: true,
  display: 'swap'
})
