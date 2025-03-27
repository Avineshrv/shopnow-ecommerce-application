'use client';

import { useState, useEffect, JSX } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Filter, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

// Define the type for a category object.
type Category = {
  id: string;
  name: string;
};

function ProductFilters(): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // We now assume categories is an array of Category objects.
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          'https://dummyjson.com/products/categories'
        );
        const data = await response.json();
        // If the API returns strings, transform them to objects:
        // const categoriesData = data.map((cat: string) => ({ id: cat, name: cat }))
        // Otherwise, if data is already an array of objects, use it directly:
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchBrands = async () => {
      try {
        const response = await fetch(
          'https://dummyjson.com/products?limit=100'
        );
        const data = await response.json();
        const uniqueBrands = [
          ...new Set(
            data.products.map((product: { brand: string }) => product.brand)
          ),
        ];
        setBrands(uniqueBrands);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };

    fetchCategories();
    fetchBrands();
  }, []);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const brandParam = searchParams.get('brand');
    const price = searchParams.get('price');
    const rating = searchParams.get('rating');

    if (categoryParam) {
      // If categoryParam is a comma‑separated list of category names
      setSelectedCategories(categoryParam.split(','));
    }

    if (brandParam) {
      setSelectedBrands(brandParam.split(','));
    }

    if (price) {
      const [min, max] = price.split('-').map(Number);
      setPriceRange([min, max || 2000]);
    }

    if (rating) {
      setSelectedRating(Number(rating));
    }
  }, [searchParams]);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);

    if (selectedCategories.length > 0) {
      params.set('category', selectedCategories.join(','));
    } else {
      params.delete('category');
    }

    if (selectedBrands.length > 0) {
      params.set('brand', selectedBrands.join(','));
    } else {
      params.delete('brand');
    }

    if (priceRange[0] > 0 || priceRange[1] < 2000) {
      params.set('price', `${priceRange[0]}-${priceRange[1]}`);
    } else {
      params.delete('price');
    }

    if (selectedRating !== null) {
      params.set('rating', selectedRating.toString());
    } else {
      params.delete('rating');
    }

    router.push(`${pathname}?${params.toString()}`);
    setIsMobileFilterOpen(false);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 2000]);
    setSelectedRating(null);
    router.push(pathname);
    setIsMobileFilterOpen(false);
  };

  const handleCategoryChange = (categoryName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleRatingChange = (ratingValue: number) => {
    setSelectedRating((prev) => (prev === ratingValue ? null : ratingValue));
  };

  const FiltersContent = () => (
    <div className="space-y-6">
      <div>
        <Button
          variant="outline"
          className="w-full mb-4"
          onClick={resetFilters}
        >
          <X className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
      </div>
      <Accordion
        type="multiple"
        defaultValue={['categories', 'brands', 'price', 'rating']}
      >
        <AccordionItem value="categories">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.name)}
                    onCheckedChange={() => handleCategoryChange(category.name)}
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="capitalize text-sm cursor-pointer"
                  >
                    {category.name.replace('-', ' ')}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brands">
          <AccordionTrigger>Brands</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={() => handleBrandChange(brand)}
                  />
                  <Label
                    htmlFor={`brand-${brand}`}
                    className="text-sm cursor-pointer"
                  >
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 px-1">
              <Slider
                defaultValue={priceRange}
                min={0}
                max={2000}
                step={10}
                value={priceRange}
                onValueChange={(value) =>
                  setPriceRange(value as [number, number])
                }
              />
              <div className="flex items-center justify-between">
                <span className="text-sm">${priceRange[0]}</span>
                <span className="text-sm">${priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="rating">
          <AccordionTrigger>Rating</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {[4, 3, 2, 1].map((ratingValue) => (
                <div key={ratingValue} className="flex items-center space-x-2">
                  <Checkbox
                    id={`rating-${ratingValue}`}
                    checked={selectedRating === ratingValue}
                    onCheckedChange={() => handleRatingChange(ratingValue)}
                  />
                  <Label
                    htmlFor={`rating-${ratingValue}`}
                    className="text-sm cursor-pointer flex items-center"
                  >
                    {ratingValue}+ Stars
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Button className="w-full" onClick={applyFilters}>
        Apply Filters
      </Button>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="md:hidden mb-4">
        <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <FiltersContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Filters */}
      <div className="hidden md:block">
        <FiltersContent />
      </div>
    </>
  );
}

export default ProductFilters;
