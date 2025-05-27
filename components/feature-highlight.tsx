import type { ReactNode } from "react"

interface FeatureHighlightProps {
  title: string
  description: string
  image: string
  imagePosition?: "left" | "right"
  features: {
    icon: ReactNode
    title: string
    description: string
  }[]
}

export function FeatureHighlight({
  title,
  description,
  image,
  imagePosition = "left",
  features,
}: FeatureHighlightProps) {
  return (
    <div className="grid gap-12 md:grid-cols-2 md:items-center">
      {imagePosition === "left" && (
        <div className="rounded-lg bg-gray-100 p-2 shadow-md">
          <img src={image || "/placeholder.svg"} alt={title} className="rounded-md" />
        </div>
      )}

      <div className={imagePosition === "right" ? "md:order-first" : ""}>
        <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
        <p className="mt-4 text-gray-600">{description}</p>

        <div className="mt-8 space-y-6">
          {features.map((feature, index) => (
            <div key={index} className="flex">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                {feature.icon}
              </div>
              <div>
                <h4 className="font-medium">{feature.title}</h4>
                <p className="mt-1 text-sm text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {imagePosition === "right" && (
        <div className="rounded-lg bg-gray-100 p-2 shadow-md">
          <img src={image || "/placeholder.svg"} alt={title} className="rounded-md" />
        </div>
      )}
    </div>
  )
}
