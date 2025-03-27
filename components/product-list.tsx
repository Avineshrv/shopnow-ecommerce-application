"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import ProductSorter from "@/components/product-sorter"

export default function ProductList({ category, brand, price, rating, sort }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [sortOption, setSortOption] = useState(sort || "default")

  const limit = 20

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)

      let url = `https://dummyjson.com/products?limit=${limit}&skip=${(page - 1) * limit}`

      // Add category filter if provided
      if (category) {
        url = `https://dummyjson.com/products/category/${category}?limit=${limit}&skip=${(page - 1) * limit}`
      }

      try {
        const response = await fetch(url)
        const data = await response.json()

        // Apply client-side filtering
        let filteredProducts = data.products

        if (brand) {
          filteredProducts = filteredProducts.filter((product) => product.brand.toLowerCase() === brand.toLowerCase())
        }

        if (price) {
          const [min, max] = price.split("-").map(Number)
          filteredProducts = filteredProducts.filter(
            (product) => product.price >= min && (max ? product.price <= max : true),
          )
        }

        if (rating) {
          const minRating = Number(rating)
          filteredProducts = filteredProducts.filter((product) => product.rating >= minRating)
        }

        // Apply sorting
        const sortedProducts = sortProducts(filteredProducts, sortOption)

        if (page === 1) {
          setProducts(sortedProducts)
        } else {
          setProducts((prev) => [...prev, ...sortedProducts])
        }

        setHasMore(data.total > page * limit)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching products:", error)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [page, category, brand, price, rating, sortOption])

  const sortProducts = (products, sortOption) => {
    switch (sortOption) {
      case "price-low":
        return [...products].sort((a, b) => a.price - b.price)
      case "price-high":
        return [...products].sort((a, b) => b.price - a.price)
      case "rating":
        return [...products].sort((a, b) => b.rating - a.rating)
      case "discount":
        return [...products].sort((a, b) => b.discountPercentage - a.discountPercentage)
      default:
        return products
    }
  }

  const handleLoadMore = () => {
    setPage((prev) => prev + 1)
  }

  const handleSortChange = (value) => {
    setSortOption(value)
    setPage(1) // Reset to first page when sort changes
  }

  if (loading && page === 1) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">Showing {products.length} products</p>
        <ProductSorter value={sortOption} onChange={handleSortChange} />
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground">Try adjusting your filters to find what you're looking for.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-8">
              <Button onClick={handleLoadMore} disabled={loading} className="min-w-[200px]">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

