import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getApprovedTestimonials } from "@/lib/storage";
import StarRating from "@/components/features/StarRating";
import type { Testimonial } from "@/types";

const TestimonialsPreview = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    getApprovedTestimonials()
      .then((items) => setTestimonials(items.slice(0, 3)))
      .catch((err) => console.error("Failed to load testimonials:", err));
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section className="py-20 bg-brand-black px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-brand-orange font-semibold text-sm uppercase tracking-widest">Client Love</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mt-2">
              What Our Clients<br />Are Saying
            </h2>
          </div>
          <Link
            to="/testimonials"
            className="text-brand-orange font-semibold hover:underline text-sm shrink-0"
          >
            Read all reviews →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-brand-orange/40 transition-colors"
            >
              <StarRating rating={t.rating} />
              <p className="text-white/75 text-sm leading-relaxed mt-4 mb-6 line-clamp-4">
                "{t.message}"
              </p>
              <div>
                <div className="text-white font-semibold text-sm">{t.name}</div>
                <div className="text-white/50 text-xs">{t.company}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsPreview;
