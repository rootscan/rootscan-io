import { JetBrains_Mono as FontMono, Inter as FontSans } from "next/font/google"
import localFont from "next/font/local"
export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const fontLocal = localFont({
  src: [
    {
      path: "../public/fonts/ObjektivMk1_Trial_Th.ttf",
      weight: "100",
    },
    {
      path: "../public/fonts/ObjektivMk1_Trial_Lt.ttf",
      weight: "200",
    },
    {
      path: "../public/fonts/ObjektivMk1_Trial_Lt.ttf",
      weight: "300",
    },
    {
      path: "../public/fonts/ObjektivMk1_Trial_Md.ttf",
      weight: "400",
    },
    {
      path: "../public/fonts/ObjektivMk1_Trial_Md.ttf",
      weight: "500",
    },
    {
      path: "../public/fonts/ObjektivMk1_Trial_SBd.ttf",
      weight: "600",
    },
    {
      path: "../public/fonts/ObjektivMk1_Trial_Bd.ttf",
      weight: "700",
    },
    {
      path: "../public/fonts/ObjektivMk1_Trial_Bd.ttf",
      weight: "800",
    },
    {
      path: "../public/fonts/ObjektivMk1_Trial_Blk.ttf",
      weight: "900",
    },
  ],
  variable: "--font-local",
})
