import OpengraphImage from "@/components/opengraph"

export const runtime = "edge"

export default async function Image() {
  return await OpengraphImage({ title: "" })
}
