// app/categories/page.tsx
import Link from 'next/link';
import Header from '@/components/header';
import Footer from '@/components/footer';

export const metadata = {
  title: 'Categories | ShopNow',
  description: 'Browse product categories',
};

export default async function CategoriesPage() {
  // The API returns an array of strings
  const res = await fetch('https://dummyjson.com/products/categories', {
    cache: 'no-store',
  });
  const categories: string[] = await res.json();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto py-8 px-4 flex-1">
        <h1 className="text-3xl font-bold mb-6">Categories</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map(
            (category) => (
              console.log(category),
              (
                <Link
                  key={category.name}
                  href={`/products?category=${category.slug}`}
                  className="block p-4 border rounded-lg text-center hover:bg-primary hover:text-white transition-colors"
                >
                  {category.name}
                </Link>
              )
            )
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
