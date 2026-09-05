import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-brand-black overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Mosdal Branding Solution"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/60 via-transparent to-transparent" />
      </div>

      {/* Orange accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-orange" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 pt-36">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-brand-orange/15 border border-brand-orange/30 text-brand-orange text-sm font-medium px-4 py-1.5 rounded-full mb-7 animate-fade-up">
            <span className="w-2 h-2 bg-brand-orange rounded-full animate-pulse" />
            Premium Printing & Branding Studio — Ibadan, Nigeria
          </div>

          <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.05] mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Bring Your<br />
            <span className="text-brand-orange">Brand</span> to Life
          </h1>

          <p className="text-white/70 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl animate-fade-up" style={{ animationDelay: "0.2s" }}>
            From bold business cards to large-format signage — we craft print and branding solutions that make your business impossible to ignore.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Link to="/quote">
              <Button
                size="lg"
                className="bg-brand-orange hover:bg-orange-600 text-white font-semibold text-base h-13 px-8 shadow-lg shadow-orange-900/30 transition-all hover:scale-[1.02]"
              >
                Get a Free Quote
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/portfolio">
              <Button
                size="lg"
                variant="outline"
                className="border-white/25 text-white hover:bg-white/10 bg-transparent font-semibold text-base h-13 px-8 gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                View Our Work
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-8 mt-14 pt-8 border-t border-white/10 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            {[
              { value: "1,200+", label: "Projects Delivered" },
              { value: "98%", label: "Client Satisfaction" },
              { value: "48h", label: "Avg. Turnaround" },
              { value: "8+", label: "Years of Excellence" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-display font-bold text-2xl text-white">{stat.value}</div>
                <div className="text-white/50 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
