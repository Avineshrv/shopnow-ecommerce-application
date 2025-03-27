"use client"

import { useState, useEffect } from "react"
import ProductCard from "@/components/product-card"

export default function RecentlyViewed() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const storedRecentlyViewed = localStorage.getItem("recentlyViewed")
    if (storedRecentlyViewed) {
      setProducts(JSON.parse(storedRecentlyViewed))
    }
  }, [])

  if (products.length === 0) {
    return <p className="text-center text-muted-foreground py-8">Products you view will appear here.</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.slice(0, 4).map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

