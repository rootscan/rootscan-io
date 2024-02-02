"use client"

import { ArrowUp } from "lucide-react"
import { Button } from "./ui/button"

export const BackToTopButton = () => {
  const isBrowser = () => typeof window !== "undefined"

  function scrollToTop() {
    if (!isBrowser()) return
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
  return (
    <Button variant="ghost" size="icon" onClick={() => scrollToTop()}>
      <span className="sr-only">Back to Top</span>
      <ArrowUp className="h-5 w-5" />
    </Button>
  )
}
