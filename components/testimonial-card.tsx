import { Star } from "lucide-react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  rating: number
}

export function TestimonialCard({ quote, author, role, rating }: TestimonialCardProps) {
  return (
    <Card className="h-full border-gray-200 transition-all hover:shadow-md">
      <CardContent className="flex flex-1 flex-col pt-6">
        <div className="mb-4 flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${i < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
            />
          ))}
        </div>
        <blockquote className="flex-1">
          <p className="text-gray-700">"{quote}"</p>
        </blockquote>
      </CardContent>
      <CardFooter className="border-t border-gray-100 pt-4">
        <div className="flex items-center">
          <div className="mr-4 h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-blue-600 to-blue-400"></div>
          <div>
            <div className="font-medium">{author}</div>
            <div className="text-sm text-gray-600">{role}</div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
