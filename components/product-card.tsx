"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { useDispatch } from "react-redux"
import { useToast } from "@/components/ui/use-toast"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { addToCart } from "@/lib/features/cart/cartSlice"

export default function ProductCard({ product }) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const dispatch = useDispatch()
  const { toast } = useToast()

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()

    dispatch(
      addToCart({
        ...product,
        quantity: 1,
      }),
    )

    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart`,
    })
  }

  const handleToggleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()

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

  // Check if product is in wishlist on mount
  useState(() => {
    const storedWishlist = localStorage.getItem("wishlist")
    if (storedWishlist) {
      const wishlist = JSON.parse(storedWishlist)
      const isInWishlist = wishlist.some((item) => item.id === product.id)
      setIsWishlisted(isInWishlist)
    }
  }, [product.id])

  // Add to recently viewed
  useState(() => {
    // Get current recently viewed
    const storedRecentlyViewed = localStorage.getItem("recentlyViewed")
    let recentlyViewed = storedRecentlyViewed ? JSON.parse(storedRecentlyViewed) : []

    // Remove if already exists
    recentlyViewed = recentlyViewed.filter((item) => item.id !== product.id)

    // Add to front of array
    recentlyViewed.unshift(product)

    // Limit to 8 items
    recentlyViewed = recentlyViewed.slice(0, 8)

    // Save updated recently viewed
    localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed))
  }, [product])

  return (
    <Link href={`/products/${product.id}`}>
      <div className="group relative border rounded-lg overflow-hidden transition-all hover:shadow-md">
        <div className="relative aspect-square bg-muted">
          <Image
            src={product.thumbnail || "/placeholder.svg"}
            alt={product.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />

          {product.discountPercentage > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500">{Math.round(product.discountPercentage)}% OFF</Badge>
          )}

          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <Button
              variant={isWishlisted ? "default" : "secondary"}
              size="icon"
              className="h-8 w-8 rounded-full opacity-70 hover:opacity-100"
              onClick={handleToggleWishlist}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? "fill-primary-foreground" : ""}`} />
            </Button>

            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full opacity-70 hover:opacity-100"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-medium line-clamp-1">{product.title}</h3>
          <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>

          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                  />
                ))}
            </div>
            <span className="text-xs text-muted-foreground">({product.rating})</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold">${product.price.toFixed(2)}</span>
            {product.discountPercentage > 0 && (
              <span className="text-sm text-muted-foreground line-through">
                ${Math.round(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

