import localFont from "next/font/local"

export const fontLocal = localFont({
  src: [
    {
      path: "../public/fonts/ObjektivMk1_Trial_Th.ttf",
      weight: "100",
    },
    {
      path: "../public/fonts/ObjektivMk1-Thin.woff2",
      weight: "200",
    },
    {
      path: "../public/fonts/ObjektivMk1-Thin.woff2",
      weight: "300",
    },
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
