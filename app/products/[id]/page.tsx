import { notFound } from "next/navigation"
import { Suspense } from "react"
import { Star } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import ProductImageCarousel from "@/components/product-image-carousel"
import AddToCartButton from "@/components/add-to-cart-button"
import AddToWishlistButton from "@/components/add-to-wishlist-button"
import SimilarProducts from "@/components/similar-products"
import Header from "@/components/header"
import Footer from "@/components/footer"

export async function generateMetadata({ params }) {
  try {
    const product = await getProduct(params.id)

    return {
      title: `${product.title} | ShopNow`,
      description: product.description,
      openGraph: {
        images: [{ url: product.thumbnail }],
      },
    }
  } catch (error) {
    return {
      title: "Product | ShopNow",
      description: "Product details",
    }
  }
}

async function getProduct(id) {
  const res = await fetch(`https://dummyjson.com/products/${id}`)

  if (!res.ok) {
    notFound()
  }

  return res.json()
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <ProductImageCarousel images={product.images} title={product.title} />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.title}</h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                      />
                    ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({Math.floor(product.rating * 10)} reviews)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold">${product.price}</span>
              {product.discountPercentage > 0 && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    ${Math.round(product.price / (1 - product.discountPercentage / 100))}
                  </span>
                  <Badge className="bg-red-500">{Math.round(product.discountPercentage)}% OFF</Badge>
                </>
              )}
            </div>

            <p className="text-muted-foreground">{product.description}</p>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">Brand:</span>
                <span>{product.brand}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Category:</span>
                <span className="capitalize">{product.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Stock:</span>
                <span>{product.stock > 0 ? `${product.stock} units` : "Out of stock"}</span>
              </div>
            </div>

            <Separator />

            <div className="flex flex-col sm:flex-row gap-4">
              <AddToCartButton product={product} />
              <AddToWishlistButton product={product} />
            </div>
          </div>
        </div>

        <Tabs defaultValue="details" className="mb-12">
          <TabsList>
            <TabsTrigger value="details">Product Details</TabsTrigger>
            <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="p-4">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Specifications</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Brand: {product.brand}</li>
                <li>Category: {product.category}</li>
                <li>Rating: {product.rating}/5</li>
                <li>Stock: {product.stock} units</li>
              </ul>
              <p>{product.description}</p>
            </div>
          </TabsContent>
          <TabsContent value="shipping" className="p-4">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Shipping Information</h3>
              <p>Free shipping on all orders over $50. Standard delivery takes 3-5 business days.</p>

              <h3 className="text-xl font-semibold">Return Policy</h3>
              <p>We accept returns within 30 days of delivery. Items must be unused and in original packaging.</p>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="p-4">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Customer Reviews</h3>
              <p>This product has a {product.rating}/5 rating based on customer reviews.</p>

              <div className="space-y-4">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="border p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {Array(5)
                            .fill(0)
                            .map((_, j) => (
                              <Star
                                key={j}
                                className={`w-4 h-4 ${j < 4 + (i % 2) ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                              />
                            ))}
                        </div>
                        <span className="text-sm font-medium">Customer {i + 1}</span>
                      </div>
                      <p className="text-sm">
                        {i === 0
                          ? `Great product! ${product.title} exceeded my expectations. Would definitely recommend.`
                          : i === 1
                            ? `I've been using this ${product.category} for a few weeks now and I'm very satisfied with the quality.`
                            : `The ${product.brand} quality is excellent as always. Fast shipping too!`}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <section>
          <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
          <Suspense fallback={<div>Loading similar products...</div>}>
            <SimilarProducts category={product.category} currentProductId={product.id} />
          </Suspense>
        </section>
      </main>
      <Footer />
    </div>
  )
}

