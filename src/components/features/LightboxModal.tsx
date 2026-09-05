import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { PortfolioItem } from "@/types";

interface LightboxModalProps {
  item: PortfolioItem | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  branding: "Branding",
  print: "Print",
  merchandise: "Merchandise",
  signage: "Signage",
  apparel: "Apparel",
};

const LightboxModal = ({ item, onClose, onPrev, onNext }: LightboxModalProps) => {
  useEffect(() => {
    if (!item) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "ArrowRight" && onNext) onNext();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [item, onClose, onPrev, onNext]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full bg-brand-black rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-black/50 hover:bg-brand-orange rounded-full flex items-center justify-center text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full aspect-video object-cover"
          />
          {onPrev && (
            <button
              onClick={onPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-brand-orange rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {onNext && (
            <button
              onClick={onNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-brand-orange rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-block bg-brand-orange/15 text-brand-orange text-xs font-semibold px-2.5 py-1 rounded-full mb-2 uppercase tracking-wider">
                {CATEGORY_LABELS[item.category] ?? item.category}
              </span>
              <h3 className="font-display font-bold text-white text-xl">{item.title}</h3>
              <p className="text-white/60 text-sm mt-2">{item.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LightboxModal;
