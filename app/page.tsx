import Link from "next/link"
import { Button } from "@/components/ui/button"
import HeroSection from "@/components/hero-section"
import OfferBanner from "@/components/offer-banner"
import FeaturedProducts from "@/components/featured-products"
import NewArrivals from "@/components/new-arrivals"
import RecentlyViewed from "@/components/recently-viewed"
import Footer from "@/components/footer"
import Header from "@/components/header"

export default async function Home() {
  // Fetch featured products
  const featuredResponse = await fetch("https://dummyjson.com/products?limit=8")
  const featuredData = await featuredResponse.json()

  // Fetch new arrivals (using category smartphones as a proxy for "new")
  const newArrivalsResponse = await fetch("https://dummyjson.com/products/category/smartphones?limit=4")
  const newArrivalsData = await newArrivalsResponse.json()

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HeroSection />

        <section className="container mx-auto py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <OfferBanner
              title="Summer Sale"
              description="Up to 50% off on selected items"
              buttonText="Shop Now"
              href="/products?sale=true"
              color="bg-orange-100"
            />
            <OfferBanner
              title="New Collection"
              description="Check out our latest arrivals"
              buttonText="Discover"
              href="/products?category=new"
              color="bg-blue-100"
            />
            <OfferBanner
              title="Free Shipping"
              description="On orders over $50"
              buttonText="Learn More"
              href="/shipping"
              color="bg-green-100"
            />
          </div>
        </section>

        <section className="container mx-auto py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link href="/products" className="text-primary hover:underline">
              View All
            </Link>
          </div>
          <FeaturedProducts products={featuredData.products} />
        </section>

        <section className="container mx-auto py-8 bg-muted/50">
          <div className="flex justify-between items-center mb-6 px-4">
            <h2 className="text-2xl font-bold">New Arrivals</h2>
            <Link href="/products?category=new" className="text-primary hover:underline">
              View All
            </Link>
          </div>
          <NewArrivals products={newArrivalsData.products} />
        </section>

        <section className="container mx-auto py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recently Viewed</h2>
          </div>
          <RecentlyViewed />
        </section>

        <section className="container mx-auto py-12 px-4">
          <div className="bg-primary/10 rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="mb-6 max-w-md mx-auto">Stay updated with the latest products, exclusive offers and news</p>
            <div className="flex max-w-md mx-auto gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

