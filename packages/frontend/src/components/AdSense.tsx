import { useEffect } from "react"

interface AdSenseProps {
  adSlot?: string
  adFormat?: string
  fullWidthResponsive?: boolean
  style?: React.CSSProperties
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export default function AdSense({
  adSlot = "auto",
  adFormat = "auto",
  fullWidthResponsive = true,
  style = { display: "block" },
}: AdSenseProps) {
  useEffect(() => {
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (error) {
      console.error("AdSense error:", error)
    }
  }, [])

  return (
    <ins
      className="adsbygoogle"
      style={style}
      data-ad-client="ca-pub-5982088421934575"
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive={fullWidthResponsive.toString()}
    />
  )
}
