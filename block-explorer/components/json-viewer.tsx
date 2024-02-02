"use client"

import { Suspense } from "react"
import ReactJson from "react18-json-view"
import "react18-json-view/src/dark.css"
import "react18-json-view/src/style.css"

export default function JsonViewer({ json }) {
  return (
    <Suspense fallback={"Loading..."}>
      <div className="overflow-x-auto">
        <ReactJson
          src={json}
          theme="a11y"
          collapsed={true}
          style={{
            backgroundColor: "rgb(255,255,255,0.1)",
            borderRadius: 20,
            padding: 5,
          }}
        />
      </div>
    </Suspense>
  )
}
