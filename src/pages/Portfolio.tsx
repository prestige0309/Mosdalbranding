import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CTABanner from "@/components/features/CTABanner";
import LightboxModal from "@/components/features/LightboxModal";
import { getPortfolioItems } from "@/lib/storage";
import type { PortfolioItem } from "@/types";
import { Loader2 } from "lucide-react";

type Category = "all" | "branding" | "print" | "merchandise" | "signage" | "apparel" | "packaging" | "cladding" | "pouch" | "flex" | "sav" | "screen printing";

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "all", label: "All Work" },
  { value: "branding", label: "Branding" },
  { value: "print", label: "Print" },
  { value: "merchandise", label: "Merchandise" },
  { value: "signage", label: "Signage" },
  { value: "apparel", label: "Apparel" },
  { value: "packaging", label: "Packaging" },
  { value: "cladding", label: "Cladding" },
  { value: "pouch", label: "Pouch" },
  { value: "flex", label: "Flex" },
  { value: "sav", label: "SAV" },
  { value: "screen printing", label: "Screen Printing" },
];

const CATEGORY_LABELS: Record<string, string> = {
  branding: "Branding",
  print: "Print",
  merchandise: "Merchandise",
  signage: "Signage",
  apparel: "Apparel",
  packaging: "Packaging",
  cladding: "Cladding",
  pouch: "Pouch",
  flex: "Flex",
  sav: "SAV",
  "screen printing": "Screen Printing",
};

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [selected, setSelected] = useState<PortfolioItem | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [allItems, setAllItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPortfolioItems()
      .then(setAllItems)
      .catch((err) => console.error("Failed to load portfolio items:", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === "all"
    ? allItems
    : allItems.filter((i) => i.category === activeCategory);

  const openLightbox = (item: PortfolioItem, i: number) => {
    setSelected(item);
    setLightboxIdx(i);
  };

  const goPrev = () => {
    const newIdx = (lightboxIdx - 1 + filtered.length) % filtered.length;
    setLightboxIdx(newIdx);
    setSelected(filtered[newIdx]);
  };

  const goNext = () => {
    const newIdx = (lightboxIdx + 1) % filtered.length;
    setLightboxIdx(newIdx);
    setSelected(filtered[newIdx]);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="bg-brand-black pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-orange" />
        <div className="max-w-7xl mx-auto">
          <span className="text-brand-orange font-semibold text-sm uppercase tracking-widest">Portfolio</span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white mt-3 mb-5 max-w-2xl leading-tight">
            Our Work Speaks<br />Louder Than Words
          </h1>
          <p className="text-white/65 text-lg max-w-xl leading-relaxed">
            Browse our portfolio of brand identities, print projects, signage, merchandise, and more delivered for clients across industries.
          </p>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-16 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-10">
            {CATEGORIES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setActiveCategory(value)}
                className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all ${
                  activeCategory === value
                    ? "bg-brand-orange text-white border-brand-orange"
                    : "bg-white text-gray-600 border-gray-200 hover:border-brand-orange hover:text-brand-orange"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-6 h-6 text-brand-orange animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No items in this category yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((item, i) => (
                <div
                  key={item.id}
                  className="group relative rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300"
                  onClick={() => openLightbox(item, i)}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <span className="inline-block bg-brand-orange text-white text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider mb-1.5">
                      {CATEGORY_LABELS[item.category] || item.category}
                    </span>
                    <h3 className="font-display font-bold text-white text-sm leading-snug">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <LightboxModal
        item={selected}
        onClose={() => setSelected(null)}
        onPrev={goPrev}
        onNext={goNext}
      />

      <CTABanner
        title="Love What You See?"
        subtitle="Let's create something this impressive for your brand. Get in touch for a free consultation."
        primaryLabel="Get a Free Quote"
        primaryPath="/quote"
        secondaryLabel="Place an Order"
        secondaryPath="/order"
      />
      <Footer />
    </div>
  );
};

export default Portfolio;