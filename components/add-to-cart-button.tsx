"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { ShoppingCart, Plus, Minus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { addToCart } from "@/lib/features/cart/cartSlice"

export default function AddToCartButton({ product }) {
  const [quantity, setQuantity] = useState(1)
  const dispatch = useDispatch()
  const { toast } = useToast()

  const handleIncrement = () => {
    setQuantity((prev) => Math.min(prev + 1, product.stock))
  }

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(prev - 1, 1))
  }

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        ...product,
        quantity,
      }),
    )

    toast({
      title: "Added to cart",
      description: `${quantity} ${quantity > 1 ? "items" : "item"} added to your cart`,
    })
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center">
        <Button variant="outline" size="icon" onClick={handleDecrement} disabled={quantity <= 1}>
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-12 text-center">{quantity}</span>
        <Button variant="outline" size="icon" onClick={handleIncrement} disabled={quantity >= product.stock}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Button className="w-full" size="lg" onClick={handleAddToCart} disabled={product.stock === 0}>
        <ShoppingCart className="mr-2 h-5 w-5" />
        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
      </Button>
    </div>
  )
}

