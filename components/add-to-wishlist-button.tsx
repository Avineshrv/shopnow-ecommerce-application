"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export default function AddToWishlistButton({ product }) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishlist")
    if (storedWishlist) {
      const wishlist = JSON.parse(storedWishlist)
      const isInWishlist = wishlist.some((item) => item.id === product.id)
      setIsWishlisted(isInWishlist)
    }
  }, [product.id])

  const handleToggleWishlist = () => {
    // Get current wishlist
    const storedWishlist = localStorage.getItem("wishlist")
    let wishlist = storedWishlist ? JSON.parse(storedWishlist) : []

    // Check if product is already in wishlist
    const existingIndex = wishlist.findIndex((item) => item.id === product.id)

    if (existingIndex >= 0) {
      // Remove from wishlist
      wishlist = wishlist.filter((item) => item.id !== product.id)
      setIsWishlisted(false)
      toast({
        title: "Removed from wishlist",
        description: `${product.title} has been removed from your wishlist`,
      })
    } else {
      // Add to wishlist
      wishlist.push(product)
      setIsWishlisted(true)
      toast({
        title: "Added to wishlist",
        description: `${product.title} has been added to your wishlist`,
      })
    }

    // Save updated wishlist
    localStorage.setItem("wishlist", JSON.stringify(wishlist))
  }

  return (
    <Button variant="outline" size="lg" className="w-full" onClick={handleToggleWishlist}>
      <Heart className={`mr-2 h-5 w-5 ${isWishlisted ? "fill-primary" : ""}`} />
      {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
    </Button>
  )
}

