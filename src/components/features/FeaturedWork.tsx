import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPortfolioItems } from "@/lib/storage";
import LightboxModal from "@/components/features/LightboxModal";
import type { PortfolioItem } from "@/types";

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

const FeaturedWork = () => {
  const [featured, setFeatured] = useState<PortfolioItem[]>([]);
  const [selected, setSelected] = useState<PortfolioItem | null>(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    getPortfolioItems()
      .then((items) => setFeatured(items.filter((i) => i.featured).slice(0, 6)))
      .catch((err) => console.error("Failed to load portfolio items:", err));
  }, []);

  if (featured.length === 0) return null;

  const openItem = (item: PortfolioItem, i: number) => {
    setSelected(item);
    setIdx(i);
  };

  const goPrev = () => {
    const newIdx = (idx - 1 + featured.length) % featured.length;
    setIdx(newIdx);
    setSelected(featured[newIdx]);
  };

  const goNext = () => {
    const newIdx = (idx + 1) % featured.length;
    setIdx(newIdx);
    setSelected(featured[newIdx]);
  };

  return (
    <section className="py-20 bg-brand-gray px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-brand-orange font-semibold text-sm uppercase tracking-widest">Recent Work</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-brand-black mt-2">
              Work That Speaks<br />for Itself
            </h2>
          </div>
          <Link
            to="/portfolio"
            className="text-brand-orange font-semibold hover:underline text-sm flex items-center gap-1 shrink-0"
          >
            View full portfolio →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((item, i) => (
            <div
              key={item.id}
              className="group relative rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300"
              onClick={() => openItem(item, i)}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <span className="inline-block bg-brand-orange text-white text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider mb-2">
                  {CATEGORY_LABELS[item.category] || item.category}
                </span>
                <h3 className="font-display font-bold text-white text-base">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <LightboxModal
        item={selected}
        onClose={() => setSelected(null)}
        onPrev={goPrev}
        onNext={goNext}
      />
    </section>
  );
};

export default FeaturedWork;