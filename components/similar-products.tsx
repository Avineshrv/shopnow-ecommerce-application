import ProductCard from "@/components/product-card"

async function getSimilarProducts(category, currentProductId) {
  const res = await fetch(`https://dummyjson.com/products/category/${category}?limit=4`)
  const data = await res.json()

  // Filter out the current product
  return data.products.filter((product) => product.id !== Number.parseInt(currentProductId))
}

export default async function SimilarProducts({ category, currentProductId }) {
  const products = await getSimilarProducts(category, currentProductId)

  if (products.length === 0) {
    return <p>No similar products found.</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

