import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function OfferBanner({ title, description, buttonText, href, color }) {
  return (
    <div className={`${color} rounded-lg p-6 flex flex-col justify-between h-full`}>
      <div>
        <h3 className="font-bold text-xl mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
      </div>
      <Button variant="secondary" asChild>
        <Link href={href}>{buttonText}</Link>
      </Button>
    </div>
  )
}

