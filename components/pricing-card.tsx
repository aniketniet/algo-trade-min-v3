import { Check } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface PricingCardProps {
  title: string
  price: string
  description: string
  features: string[]
  buttonText: string
  buttonVariant?: "default" | "outline"
  popular?: boolean
}

export function PricingCard({
  title,
  price,
  description,
  features,
  buttonText,
  buttonVariant = "default",
  popular = false,
}: PricingCardProps) {
  return (
    <Card
      className={`relative flex flex-col border-gray-200 transition-all hover:shadow-md ${
        popular ? "border-blue-200 shadow-md" : ""
      }`}
    >
      {popular && (
        <div className="absolute -top-4 left-0 right-0 mx-auto w-32 rounded-full bg-blue-600 py-1 text-center text-sm font-medium text-white">
          Most Popular
        </div>
      )}
      <CardHeader className={popular ? "pt-8" : ""}>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="mb-6 flex items-baseline">
          <span className="text-4xl font-bold">{price}</span>
          <span className="ml-1 text-gray-600">/month</span>
        </div>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Link href="/login" className="w-full">
          <Button
            className={`w-full ${
              buttonVariant === "default" ? "bg-blue-600 hover:bg-blue-700" : "border-blue-600 text-blue-600"
            }`}
            variant={buttonVariant}
          >
            {buttonText}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
